export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

interface ChatModel {
	id: string;
	name: string;
	description: string;
}

export const chatModels: Array<ChatModel> = [
	{
		id: 'chat-model',
		name: 'Chat model',
		description: 'Primary model for all-purpose chat'
	},
	{
		id: 'chat-model-reasoning',
		name: 'Reasoning model',
		description: 'Uses advanced reasoning'
	}
];
