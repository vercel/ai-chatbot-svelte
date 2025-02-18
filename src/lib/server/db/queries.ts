import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { POSTGRES_URL } from '$env/static/private';
import { ResultAsync, fromPromise, ok, safeTry } from 'neverthrow';
import {
	user,
	chat,
	type User,
	document,
	type Suggestion,
	suggestion,
	type Message,
	message,
	vote,
	type Session,
	session,
	type AuthUser
} from './schema';
import type { DbError } from '$lib/errors/db';
import { DbInternalError } from '$lib/errors/db/internal-error';
import ms from 'ms';
import { unwrapSingleQueryResult } from './utils';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(POSTGRES_URL);
const db = drizzle(client);

export function getAuthUser(email: string): ResultAsync<AuthUser, DbError> {
	return safeTry(async function* () {
		const userResult = yield* fromPromise(
			db.select().from(user).where(eq(user.email, email)),
			(e) => new DbInternalError({ cause: e })
		);
		return unwrapSingleQueryResult(userResult, email, 'User');
	});
}

export function getUser(email: string): ResultAsync<User, DbError> {
	return safeTry(async function* () {
		const userResult = yield* fromPromise(
			db.select().from(user).where(eq(user.email, email)),
			(e) => new DbInternalError({ cause: e })
		);
		const { password: _, ...rest } = yield* unwrapSingleQueryResult(userResult, email, 'User');

		return ok(rest);
	});
}

export function createAuthUser(email: string, password: string): ResultAsync<AuthUser, DbError> {
	return safeTry(async function* () {
		const salt = genSaltSync(10);
		const hash = hashSync(password, salt);

		const userResult = yield* fromPromise(
			db.insert(user).values({ email, password: hash }).returning(),
			(e) => {
				console.error(e);
				return new DbInternalError({ cause: e });
			}
		);

		return unwrapSingleQueryResult(userResult, email, 'User');
	});
}

export function createSession(value: Session): ResultAsync<Session, DbError> {
	return safeTry(async function* () {
		const sessionResult = yield* fromPromise(
			db.insert(session).values(value).returning(),
			(e) => new DbInternalError({ cause: e })
		);
		return unwrapSingleQueryResult(sessionResult, value.id, 'Session');
	});
}

export function getFullSession(
	sessionId: string
): ResultAsync<{ session: Session; user: User }, DbError> {
	return safeTry(async function* () {
		const sessionResult = yield* fromPromise(
			db
				.select({ user, session })
				.from(session)
				.innerJoin(user, eq(session.userId, user.id))
				.where(eq(session.id, sessionId)),
			(e) => new DbInternalError({ cause: e })
		);
		return unwrapSingleQueryResult(sessionResult, sessionId, 'Session');
	});
}

export function deleteSession(sessionId: string): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db.delete(session).where(eq(session.id, sessionId)),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(undefined);
	});
}

export function extendSession(sessionId: string): ResultAsync<Session, DbError> {
	return safeTry(async function* () {
		const sessionResult = yield* fromPromise(
			db
				.update(session)
				.set({ expiresAt: new Date(Date.now() + ms('30d')) })
				.where(eq(session.id, sessionId))
				.returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(sessionResult, sessionId, 'Session');
	});
}

export function deleteSessionsForUser(userId: string): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db.delete(session).where(eq(session.userId, userId)),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(undefined);
	});
}

export async function saveChat({
	id,
	userId,
	title
}: {
	id: string;
	userId: string;
	title: string;
}) {
	try {
		return await db.insert(chat).values({
			id,
			createdAt: new Date(),
			userId,
			title
		});
	} catch (error) {
		console.error('Failed to save chat in database');
		throw error;
	}
}

export async function deleteChatById({ id }: { id: string }) {
	try {
		await db.delete(vote).where(eq(vote.chatId, id));
		await db.delete(message).where(eq(message.chatId, id));

		return await db.delete(chat).where(eq(chat.id, id));
	} catch (error) {
		console.error('Failed to delete chat by id from database');
		throw error;
	}
}

export async function getChatsByUserId({ id }: { id: string }) {
	try {
		return await db.select().from(chat).where(eq(chat.userId, id)).orderBy(desc(chat.createdAt));
	} catch (error) {
		console.error('Failed to get chats by user from database');
		throw error;
	}
}

export async function getChatById({ id }: { id: string }) {
	try {
		const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
		return selectedChat;
	} catch (error) {
		console.error('Failed to get chat by id from database');
		throw error;
	}
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
	try {
		return await db.insert(message).values(messages);
	} catch (error) {
		console.error('Failed to save messages in database', error);
		throw error;
	}
}

export async function getMessagesByChatId({ id }: { id: string }) {
	try {
		return await db
			.select()
			.from(message)
			.where(eq(message.chatId, id))
			.orderBy(asc(message.createdAt));
	} catch (error) {
		console.error('Failed to get messages by chat id from database', error);
		throw error;
	}
}

export async function voteMessage({
	chatId,
	messageId,
	type
}: {
	chatId: string;
	messageId: string;
	type: 'up' | 'down';
}) {
	try {
		const [existingVote] = await db
			.select()
			.from(vote)
			.where(and(eq(vote.messageId, messageId)));

		if (existingVote) {
			return await db
				.update(vote)
				.set({ isUpvoted: type === 'up' })
				.where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
		}
		return await db.insert(vote).values({
			chatId,
			messageId,
			isUpvoted: type === 'up'
		});
	} catch (error) {
		console.error('Failed to upvote message in database', error);
		throw error;
	}
}

export async function getVotesByChatId({ id }: { id: string }) {
	try {
		return await db.select().from(vote).where(eq(vote.chatId, id));
	} catch (error) {
		console.error('Failed to get votes by chat id from database', error);
		throw error;
	}
}

export async function saveDocument({
	id,
	title,
	kind,
	content,
	userId
}: {
	id: string;
	title: string;
	kind: never;
	content: string;
	userId: string;
}) {
	try {
		return await db.insert(document).values({
			id,
			title,
			kind,
			content,
			userId,
			createdAt: new Date()
		});
	} catch (error) {
		console.error('Failed to save document in database');
		throw error;
	}
}

export async function getDocumentsById({ id }: { id: string }) {
	try {
		const documents = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(asc(document.createdAt));

		return documents;
	} catch (error) {
		console.error('Failed to get document by id from database');
		throw error;
	}
}

export async function getDocumentById({ id }: { id: string }) {
	try {
		const [selectedDocument] = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(desc(document.createdAt));

		return selectedDocument;
	} catch (error) {
		console.error('Failed to get document by id from database');
		throw error;
	}
}

export async function deleteDocumentsByIdAfterTimestamp({
	id,
	timestamp
}: {
	id: string;
	timestamp: Date;
}) {
	try {
		await db
			.delete(suggestion)
			.where(and(eq(suggestion.documentId, id), gt(suggestion.documentCreatedAt, timestamp)));

		return await db
			.delete(document)
			.where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
	} catch (error) {
		console.error('Failed to delete documents by id after timestamp from database');
		throw error;
	}
}

export async function saveSuggestions({ suggestions }: { suggestions: Array<Suggestion> }) {
	try {
		return await db.insert(suggestion).values(suggestions);
	} catch (error) {
		console.error('Failed to save suggestions in database');
		throw error;
	}
}

export async function getSuggestionsByDocumentId({ documentId }: { documentId: string }) {
	try {
		return await db
			.select()
			.from(suggestion)
			.where(and(eq(suggestion.documentId, documentId)));
	} catch (error) {
		console.error('Failed to get suggestions by document version from database');
		throw error;
	}
}

export async function getMessageById({ id }: { id: string }) {
	try {
		return await db.select().from(message).where(eq(message.id, id));
	} catch (error) {
		console.error('Failed to get message by id from database');
		throw error;
	}
}

export async function deleteMessagesByChatIdAfterTimestamp({
	chatId,
	timestamp
}: {
	chatId: string;
	timestamp: Date;
}) {
	try {
		const messagesToDelete = await db
			.select({ id: message.id })
			.from(message)
			.where(and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)));

		const messageIds = messagesToDelete.map((message) => message.id);

		if (messageIds.length > 0) {
			await db
				.delete(vote)
				.where(and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)));

			return await db
				.delete(message)
				.where(and(eq(message.chatId, chatId), inArray(message.id, messageIds)));
		}
	} catch (error) {
		console.error('Failed to delete messages by id after timestamp from database');
		throw error;
	}
}

export async function updateChatVisiblityById({
	chatId,
	visibility
}: {
	chatId: string;
	visibility: 'private' | 'public';
}) {
	try {
		return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
	} catch (error) {
		console.error('Failed to update chat visibility in database');
		throw error;
	}
}
