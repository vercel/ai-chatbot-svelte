import type { VisibilityType } from '$lib/components/visibility-selector.svelte';
import type { Chat } from '$lib/server/db/schema';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';

const contextKey = Symbol('ChatHistory');

export class ChatHistory {
	chats = $state<Chat[]>([]);

	constructor(chats: Chat[]) {
		this.chats = chats;
	}

	getChatDetails = (chatId: string) => {
		return this.chats.find((c) => c.id === chatId);
	};

	updateVisibility = async (chatId: string, visibility: VisibilityType) => {
		console.log('calling');
		const chat = this.chats.find((c) => c.id === chatId);
		if (chat) {
			chat.visibility = visibility;
		}
		const res = await fetch('/api/chat/visibility', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ chatId, visibility })
		});
		if (!res.ok) {
			toast.error('Failed update chat visibility');
			// try reloading data from source in case another competing mutation caused an issue
			await this.refetch();
		}
	};

	setContext() {
		setContext(contextKey, this);
	}

	async refetch() {
		const res = await fetch('/api/history');
		if (res.ok) {
			this.chats = await res.json();
		}
	}

	static fromContext(): ChatHistory {
		return getContext(contextKey);
	}
}
