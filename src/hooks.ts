import { ChatHistory } from '$lib/hooks/chat-history.svelte';
import { SelectedModel } from '$lib/hooks/selected-model.svelte';
import type { Transport } from '@sveltejs/kit';

export const transport: Transport = {
	SelectedModel: {
		encode: (value) => value instanceof SelectedModel && value.value,
		decode: (value) => new SelectedModel(value)
	},
	ChatHistory: {
		encode: (value) => value instanceof ChatHistory && value.chats,
		decode: (value) => new ChatHistory(value)
	}
};
