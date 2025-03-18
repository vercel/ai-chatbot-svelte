import { myProvider } from '$lib/server/ai/models';
import { systemPrompt } from '$lib/server/ai/prompts.js';
import { generateTitleFromUserMessage } from '$lib/server/ai/utils';
import { deleteChatById, getChatById, saveChat, saveMessages } from '$lib/server/db/queries.js';
import { getMostRecentUserMessage, sanitizeResponseMessages } from '$lib/utils/chat.js';
import { error } from '@sveltejs/kit';
import { createDataStreamResponse, smoothStream, streamText, type Message } from 'ai';
import { ok, safeTry } from 'neverthrow';

export async function POST({ request, locals: { user } }) {
	// TODO: zod?
	const {
		id,
		messages,
		selectedChatModel
	}: { id: string; messages: Message[]; selectedChatModel: string } = await request.json();

	if (!user) {
		error(401, 'Unauthorized');
	}

	const userMessage = getMostRecentUserMessage(messages);

	if (!userMessage) {
		error(400, 'No user message found');
	}

	await safeTry(async function* () {
		const chat = await getChatById({ id });
		if (chat.isErr()) {
			if (chat.error._tag === 'DbEntityNotFoundError') {
				const title = yield* generateTitleFromUserMessage({ message: userMessage });
				return saveChat({ id, userId: user.id, title });
			}
			return chat;
		}
		if (chat.value.userId !== user.id) {
			error(403, 'Forbidden');
		}
		return ok(undefined);
	}).orElse(() => error(500, 'An error occurred while processing your request'));

	await saveMessages({
		messages: [{ ...userMessage, createdAt: new Date(), chatId: id }]
	}).orElse(() => error(500, 'An error occurred while processing your request'));

	return createDataStreamResponse({
		execute: (dataStream) => {
			const result = streamText({
				model: myProvider.languageModel(selectedChatModel),
				system: systemPrompt({ selectedChatModel }),
				messages,
				maxSteps: 5,
				experimental_activeTools: [],
				// TODO
				// selectedChatModel === 'chat-model-reasoning'
				// 	? []
				// 	: ['getWeather', 'createDocument', 'updateDocument', 'requestSuggestions'],
				experimental_transform: smoothStream({ chunking: 'word' }),
				experimental_generateMessageId: crypto.randomUUID,
				// TODO
				// tools: {
				// 	getWeather,
				// 	createDocument: createDocument({ session, dataStream }),
				// 	updateDocument: updateDocument({ session, dataStream }),
				// 	requestSuggestions: requestSuggestions({
				// 		session,
				// 		dataStream
				// 	})
				// },
				onFinish: async ({ response, reasoning }) => {
					const sanitizedResponseMessages = sanitizeResponseMessages({
						messages: response.messages,
						reasoning
					});

					await saveMessages({
						messages: sanitizedResponseMessages.map((message) => {
							return {
								id: message.id,
								chatId: id,
								role: message.role,
								content: message.content,
								createdAt: new Date()
							};
						})
					});
				},
				experimental_telemetry: {
					isEnabled: true,
					functionId: 'stream-text'
				}
			});

			result.mergeIntoDataStream(dataStream, {
				sendReasoning: true
			});
		},
		onError: () => {
			return 'Oops, an error occured!';
		}
	});
}

export async function DELETE({ locals: { user }, request }) {
	// TODO: zod
	const { id }: { id: string } = await request.json();
	if (!user) {
		error(401, 'Unauthorized');
	}

	return await getChatById({ id })
		.andTee((chat) => {
			if (chat.userId !== user.id) {
				error(403, 'Forbidden');
			}
		})
		.andThen(deleteChatById)
		.match(
			() => new Response('Chat deleted', { status: 200 }),
			() => error(500, 'An error occurred while processing your request')
		);
}
