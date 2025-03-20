<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import type { Attachment, Message } from 'ai';
	import { toast } from 'svelte-sonner';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import ChatHeader from './chat-header.svelte';
	import type { Chat as DbChat } from '$lib/server/db/schema';
	import Messages from './messages.svelte';
	import MultimodalInput from './multimodal-input.svelte';

	let {
		chat,
		readonly,
		initialMessages
	}: {
		chat: DbChat | undefined;
		readonly: boolean;
		initialMessages: Message[];
	} = $props();

	const chatHistory = ChatHistory.fromContext();

	const chatClient = $derived(
		new Chat({
			id: chat?.id,
			initialMessages,
			sendExtraMessageFields: true,
			generateId: crypto.randomUUID.bind(crypto),
			onFinish: async () => {
				await chatHistory.refetch();
			},
			onError: (error) => {
				toast.error(error.message);
			}
		})
	);

	let attachments = $state<Attachment[]>([]);
</script>

<div class="flex h-dvh min-w-0 flex-col bg-background">
	<ChatHeader {chat} {readonly} />
	<Messages
		{readonly}
		loading={chatClient.status === 'streaming' || chatClient.status === 'submitted'}
		messages={chatClient.messages}
	/>

	<form class="mx-auto flex w-full gap-2 bg-background px-4 pb-4 md:max-w-3xl md:pb-6">
		{#if !readonly}
			<MultimodalInput {attachments} {chatClient} class="flex-1" />
		{/if}
	</form>
</div>

<!-- TODO -->
<!-- <Artifact
	chatId={id}
	{input}
	{setInput}
	{handleSubmit}
	{isLoading}
	{stop}
	{attachments}
	{setAttachments}
	{append}
	{messages}
	{setMessages}
	{reload}
	{votes}
	{readonly}
/> -->
