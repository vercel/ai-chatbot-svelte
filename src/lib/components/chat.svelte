<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import type { Message } from 'ai';
	import { toast } from 'svelte-sonner';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import ChatHeader from './chat-header.svelte';
	import type { Chat as DbChat } from '$lib/server/db/schema';

	let {
		chat,
		isReadonly,
		initialMessages
	}: {
		chat: DbChat | undefined;
		isReadonly: boolean;
		initialMessages: Message[];
	} = $props();

	const chatClient = $derived(
		new Chat({
			id: chat?.id,
			initialMessages,
			get body() {
				return { id: chat?.id };
			},
			sendExtraMessageFields: true,
			generateId: crypto.randomUUID.bind(crypto),
			onFinish: () => {
				ChatHistory.invalidate();
			},
			onError: (error) => {
				toast.error(error.message);
			}
		})
	);
</script>

<div class="flex h-dvh min-w-0 flex-col bg-background">
	<ChatHeader {chat} {isReadonly} />
	<!-- TODO -->
	<!-- <Messages
		chatId={id}
		{isLoading}
		{votes}
		{messages}
		{setMessages}
		{reload}
		{isReadonly}
		{isArtifactVisible}
	/>

	<form class="mx-auto flex w-full gap-2 bg-background px-4 pb-4 md:max-w-3xl md:pb-6">
		{#if !isReadonly}
			<MultimodalInput
				chatId={id}
				{input}
				{setInput}
				{handleSubmit}
				{isLoading}
				{stop}
				{attachments}
				{setAttachments}
				{messages}
				{setMessages}
				{append}
			/>
		{/if}
	</form> -->
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
	{isReadonly}
/> -->
