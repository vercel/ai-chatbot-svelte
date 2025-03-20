<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import SparklesIcon from '../icons/sparkles.svelte';
	import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
	import { Button } from '../ui/button';
	import PencilEditIcon from '../icons/pencil-edit.svelte';
	import PreviewAttachment from '../preview-attachment.svelte';
	import { Markdown } from '../markdown';
	import MessageReasoning from '../message-reasoning.svelte';
	import { fly } from 'svelte/transition';
	import type { UIMessage } from '@ai-sdk/svelte';

	let { message, readonly, loading }: { message: UIMessage; readonly: boolean; loading: boolean } =
		$props();

	let mode = $state<'view' | 'edit'>('view');
</script>

<div
	class="group/message mx-auto w-full max-w-3xl px-4"
	data-role={message.role}
	in:fly|global={{ opacity: 0, y: 5 }}
>
	<div
		class={cn(
			'flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
			{
				'w-full': mode === 'edit',
				'group-data-[role=user]/message:w-fit': mode !== 'edit'
			}
		)}
	>
		{#if message.role === 'assistant'}
			<div
				class="flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border"
			>
				<div class="translate-y-px">
					<SparklesIcon size={14} />
				</div>
			</div>
		{/if}

		<div class="flex w-full flex-col gap-4">
			{#if message.experimental_attachments}
				<div class="flex flex-row justify-end gap-2">
					{#each message.experimental_attachments as attachment (attachment.url)}
						<PreviewAttachment {attachment} />
					{/each}
				</div>
			{/if}

			{#if message.reasoning}
				<MessageReasoning {loading} reasoning={message.reasoning} />
			{/if}

			{#if (message.content || message.reasoning) && mode === 'view'}
				<div class="flex flex-row items-start gap-2">
					{#if message.role === 'user' && !readonly}
						<Tooltip>
							<TooltipTrigger>
								{#snippet child({ props })}
									<Button
										{...props}
										variant="ghost"
										class="h-fit rounded-full px-2 text-muted-foreground opacity-0 group-hover/message:opacity-100"
										onclick={() => {
											mode = 'edit';
										}}
									>
										<PencilEditIcon />
									</Button>
								{/snippet}
							</TooltipTrigger>
							<TooltipContent>Edit message</TooltipContent>
						</Tooltip>
					{/if}
					<div
						class={cn('flex flex-col gap-4', {
							'rounded-xl bg-primary px-3 py-2 text-primary-foreground': message.role === 'user'
						})}
					>
						<Markdown md={message.content} />
					</div>
				</div>
			{/if}
			{#if message.content && mode === 'edit'}
				<div class="flex flex-row items-start gap-2">
					<div class="size-8"></div>

					<!-- TODO -->
					<!-- <MessageEditor key={message.id} {message} {setMode} {setMessages} {reload} /> -->
				</div>
			{/if}

			<!-- TODO -->
			<!-- {#if message.toolInvocations && message.toolInvocations.length > 0}
				<div class="flex flex-col gap-4">
					{#each message.toolInvocations as toolInvocation (toolInvocation.toolCallId)}
						{@const { toolName, toolCallId, state, args } = toolInvocation}
						{#if state === 'result'}
							{@const { result } = toolInvocation}
							<div>
								{#if toolName === 'getWeather'}
									<Weather weatherAtLocation={result} />
								{:else if toolName === 'createDocument'}
									<DocumentPreview {readonly} {result} />
								{:else if toolName === 'updateDocument'}
									<DocumentToolResult type="update" {result} {readonly} />
								{:else if toolName === 'requestSuggestions'}
									<DocumentToolResult type="request-suggestions" {result} {readonly} />
								{:else}
									<pre>{JSON.stringify(result, null, 2)}</pre>
								{/if}
							</div>
						{:else}
							<div
								class={cn({
									skeleton: ['getWeather'].includes(toolName)
								})}
							>
								{#if toolName === 'getWeather'}
									<Weather />
								{:else if toolName === 'createDocument'}
									<DocumentPreview {readonly} {args} />
								{:else if toolName === 'updateDocument'}
									<DocumentToolCall type="update" {args} {readonly} />
								{:else if toolName === 'requestSuggestions'}
									<DocumentToolCall type="request-suggestions" {args} {readonly} />
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			{/if} -->

			<!-- TODO -->
			<!-- {#if !readonly}
				<MessageActions key={`action-${message.id}`} {chatId} {message} {vote} {isLoading} />
			{/if} -->
		</div>
	</div>
</div>
