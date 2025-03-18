import { ChatHistory } from '$lib/hooks/chat-history.svelte.js';
import type { Chat } from '$lib/server/db/schema.js';

export async function load({ data, fetch }) {
	const { user } = data;
	let chats: Chat[] = [];
	if (user) {
		const res = await fetch('/api/history');
		chats = await res.json();
	}
	return {
		chatHistory: new ChatHistory(chats),
		...data
	};
}
