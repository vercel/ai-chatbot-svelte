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
	type AuthUser,
	type Chat,
	type Vote
} from './schema';
import type { DbError } from '$lib/errors/db';
import { DbInternalError } from '$lib/errors/db';
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
				.select({ user: { id: user.id, email: user.email }, session })
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

export function saveChat({
	id,
	userId,
	title
}: {
	id: string;
	userId: string;
	title: string;
}): ResultAsync<Chat, DbError> {
	return safeTry(async function* () {
		const insertResult = yield* fromPromise(
			db
				.insert(chat)
				.values({
					id,
					createdAt: new Date(),
					userId,
					title
				})
				.returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(insertResult, id, 'Chat');
	});
}

export function deleteChatById({ id }: { id: string }): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		const actions = [
			() => db.delete(vote).where(eq(vote.chatId, id)),
			() => db.delete(message).where(eq(message.chatId, id)),
			() => db.delete(chat).where(eq(chat.id, id))
		];

		for (const action of actions) {
			yield* fromPromise(action(), (e) => new DbInternalError({ cause: e }));
		}

		return ok(undefined);
	});
}

export function getChatsByUserId({ id }: { id: string }): ResultAsync<Chat[], DbError> {
	return fromPromise(
		db.select().from(chat).where(eq(chat.userId, id)).orderBy(desc(chat.createdAt)),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getChatById({ id }: { id: string }): ResultAsync<Chat, DbError> {
	return safeTry(async function* () {
		const chatResult = yield* fromPromise(
			db.select().from(chat).where(eq(chat.id, id)),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(chatResult, id, 'Chat');
	});
}

export function saveMessages({
	messages
}: {
	messages: Array<Message>;
}): ResultAsync<Message[], DbError> {
	return safeTry(async function* () {
		const insertResult = yield* fromPromise(
			db.insert(message).values(messages).returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(insertResult);
	});
}

export function getMessagesByChatId({ id }: { id: string }): ResultAsync<Message[], DbError> {
	return safeTry(async function* () {
		const messages = yield* fromPromise(
			db.select().from(message).where(eq(message.chatId, id)).orderBy(asc(message.createdAt)),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(messages);
	});
}

export function voteMessage({
	chatId,
	messageId,
	type
}: {
	chatId: string;
	messageId: string;
	type: 'up' | 'down';
}): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db
				.insert(vote)
				.values({
					chatId,
					messageId,
					isUpvoted: type === 'up'
				})
				.onConflictDoUpdate({
					target: [vote.messageId, vote.chatId],
					set: { isUpvoted: type === 'up' }
				}),
			(e) => new DbInternalError({ cause: e })
		);
		return ok(undefined);
	});
}

export function getVotesByChatId({ id }: { id: string }): ResultAsync<Vote[], DbError> {
	return fromPromise(
		db.select().from(vote).where(eq(vote.chatId, id)),
		(e) => new DbInternalError({ cause: e })
	);
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

export function saveSuggestions({
	suggestions
}: {
	suggestions: Array<Suggestion>;
}): ResultAsync<Suggestion[], DbError> {
	return fromPromise(
		db.insert(suggestion).values(suggestions).returning(),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getSuggestionsByDocumentId({
	documentId
}: {
	documentId: string;
}): ResultAsync<Suggestion[], DbError> {
	return fromPromise(
		db.select().from(suggestion).where(eq(suggestion.documentId, documentId)),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getMessageById({ id }: { id: string }): ResultAsync<Message, DbError> {
	return safeTry(async function* () {
		const messageResult = yield* fromPromise(
			db.select().from(message).where(eq(message.id, id)),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(messageResult, id, 'Message');
	});
}

export function deleteMessagesByChatIdAfterTimestamp({
	chatId,
	timestamp
}: {
	chatId: string;
	timestamp: Date;
}): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		const messagesToDelete = yield* fromPromise(
			db
				.select({ id: message.id })
				.from(message)
				.where(and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))),
			(e) => new DbInternalError({ cause: e })
		);
		const messageIds = messagesToDelete.map((message) => message.id);
		if (messageIds.length > 0) {
			const votes = fromPromise(
				db.delete(vote).where(and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))),
				(e) => new DbInternalError({ cause: e })
			);
			const messages = fromPromise(
				db.delete(message).where(and(eq(message.chatId, chatId), inArray(message.id, messageIds))),
				(e) => new DbInternalError({ cause: e })
			);
			yield* votes;
			yield* messages;
		}
		return ok(undefined);
	});
}

export function deleteTrailingMessages({ id }: { id: string }): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		const message = yield* getMessageById({ id });
		yield* deleteMessagesByChatIdAfterTimestamp({
			chatId: message.chatId,
			timestamp: message.createdAt
		});
		return ok(undefined);
	});
}

export function updateChatVisiblityById({
	chatId,
	visibility
}: {
	chatId: string;
	visibility: 'private' | 'public';
}): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db.update(chat).set({ visibility }).where(eq(chat.id, chatId)),
			(e) => new DbInternalError({ cause: e })
		);
		return ok(undefined);
	});
}
