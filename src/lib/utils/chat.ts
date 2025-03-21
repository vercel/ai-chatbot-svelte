import type { Attachment, CoreAssistantMessage, CoreToolMessage, Message } from 'ai';
import type { Message as DBMessage, Document } from '$lib/server/db/schema';
import type { UIMessage } from '@ai-sdk/svelte';

export function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
	return messages.map((message) => ({
		id: message.id,
		parts: message.parts as UIMessage['parts'],
		role: message.role as UIMessage['role'],
		// Note: content will soon be deprecated in @ai-sdk/react
		content: '',
		createdAt: message.createdAt,
		experimental_attachments: (message.attachments as Array<Attachment>) ?? []
	}));
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

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getTrailingMessageId({
	messages
}: {
	messages: Array<ResponseMessage>;
}): string | null {
	const trailingMessage = messages.at(-1);

	if (!trailingMessage) return null;

	return trailingMessage.id;
}
