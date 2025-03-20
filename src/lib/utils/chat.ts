import type { CoreAssistantMessage, CoreToolMessage, Message, ToolInvocation } from 'ai';
import type { Message as DBMessage, Document } from '$lib/server/db/schema';
import type { UIMessage } from '@ai-sdk/svelte';

function addToolMessageToChat({
	toolMessage,
	messages
}: {
	toolMessage: CoreToolMessage;
	messages: Array<Message>;
}): Array<Message> {
	return messages.map((message) => {
		if (message.toolInvocations) {
			return {
				...message,
				toolInvocations: message.toolInvocations.map((toolInvocation) => {
					const toolResult = toolMessage.content.find(
						(tool) => tool.toolCallId === toolInvocation.toolCallId
					);

					if (toolResult) {
						return {
							...toolInvocation,
							state: 'result',
							result: toolResult.result
						};
					}

					return toolInvocation;
				})
			};
		}

		return message;
	});
}

export function convertToUIMessages(messages: Array<DBMessage>): Array<Message> {
	return messages.reduce((chatMessages: Array<Message>, message) => {
		if (message.role === 'tool') {
			return addToolMessageToChat({
				toolMessage: message as CoreToolMessage,
				messages: chatMessages
			});
		}

		let textContent = '';
		let reasoning: string | undefined = undefined;
		const toolInvocations: Array<ToolInvocation> = [];

		if (typeof message.content === 'string') {
			textContent = message.content;
		} else if (Array.isArray(message.content)) {
			for (const content of message.content) {
				if (content.type === 'text') {
					textContent += content.text;
				} else if (content.type === 'tool-call') {
					toolInvocations.push({
						state: 'call',
						toolCallId: content.toolCallId,
						toolName: content.toolName,
						args: content.args
					});
				} else if (content.type === 'reasoning') {
					reasoning = content.reasoning;
				}
			}
		}

		chatMessages.push({
			id: message.id,
			role: message.role as Message['role'],
			content: textContent,
			reasoning,
			toolInvocations
		});

		return chatMessages;
	}, []);
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function sanitizeResponseMessages({
	messages,
	reasoning
}: {
	messages: Array<ResponseMessage>;
	reasoning: string | undefined;
}) {
	const toolResultIds: Array<string> = [];

	for (const message of messages) {
		if (message.role === 'tool') {
			for (const content of message.content) {
				if (content.type === 'tool-result') {
					toolResultIds.push(content.toolCallId);
				}
			}
		}
	}

	const messagesBySanitizedContent = messages.map((message) => {
		if (message.role !== 'assistant') return message;

		if (typeof message.content === 'string') return message;

		const sanitizedContent = message.content.filter((content) =>
			content.type === 'tool-call'
				? toolResultIds.includes(content.toolCallId)
				: content.type === 'text'
					? content.text.length > 0
					: true
		);

		if (reasoning) {
			// @ts-expect-error: reasoning message parts in sdk is wip
			sanitizedContent.push({ type: 'reasoning', reasoning });
		}

		return {
			...message,
			content: sanitizedContent
		};
	});

	return messagesBySanitizedContent.filter((message) => message.content.length > 0);
}

export function sanitizeUIMessages(messages: Array<UIMessage>): Array<UIMessage> {
	const messagesBySanitizedToolInvocations = messages.map((message) => {
		if (message.role !== 'assistant') return message;

		if (!message.toolInvocations) return message;

		const toolResultIds: Array<string> = [];

		for (const toolInvocation of message.toolInvocations) {
			if (toolInvocation.state === 'result') {
				toolResultIds.push(toolInvocation.toolCallId);
			}
		}

		const sanitizedToolInvocations = message.toolInvocations.filter(
			(toolInvocation) =>
				toolInvocation.state === 'result' || toolResultIds.includes(toolInvocation.toolCallId)
		);

		return {
			...message,
			toolInvocations: sanitizedToolInvocations
		};
	});

	return messagesBySanitizedToolInvocations.filter(
		(message) =>
			message.content.length > 0 || (message.toolInvocations && message.toolInvocations.length > 0)
	);
}

export function getMostRecentUserMessage(messages: Array<Message>) {
	const userMessages = messages.filter((message) => message.role === 'user');
	return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(documents: Array<Document>, index: number) {
	if (!documents) return new Date();
	if (index > documents.length) return new Date();

	return documents[index].createdAt;
}
