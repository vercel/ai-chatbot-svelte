<script lang="ts">
	import { onMount } from 'svelte';
	import { Textarea } from './ui/textarea';
	import { Button } from './ui/button';
	import { cn } from '$lib/utils/shadcn';
	import type { UIMessage } from '@ai-sdk/svelte';

	let {
		message,
		setMode,
		setMessages,
		reload
	}: {
		message: UIMessage;
		setMode: (mode: 'view' | 'edit') => void;
		setMessages: (fn: (prev: UIMessage[]) => UIMessage[]) => void;
		reload: (edited: UIMessage) => void | Promise<void>;
	} = $props();

	let textPartIndex = message.parts.findIndex((p) => p.type === 'text');
	let draft = $state(message.parts.find((p) => p.type === 'text')?.text ?? '');
	let isSubmitting = $state(false);
	let textareaRef = $state<HTMLTextAreaElement | null>(null);

	const autosize = () => {
		if (!textareaRef?.style) return;
		textareaRef.style.height = 'auto';
		textareaRef.style.height = `${textareaRef.scrollHeight + 2}px`;
	};

	const cancel = () => {
		setMode('view');
	};

	const save = async () => {
		isSubmitting = true;

		const trimmed = draft.trim();
		const original = (
			message.parts[textPartIndex] as Extract<UIMessage['parts'][number], { type: 'text' }>
		).text.trim();

		if (trimmed === original) {
			isSubmitting = false;
			cancel();
			return;
		}

		const updated: UIMessage = {
			...message,
			parts: [{ type: 'text', text: trimmed }]
		};

		setMessages((prev) => {
			const index = prev.findIndex((m) => m.id === updated.id);
			if (index !== -1) {
				return [...prev.slice(0, index), updated];
			}
			return prev;
		});

		setMode('view');
		await reload(updated);
		isSubmitting = false;
	};

	onMount(autosize);
</script>

<div class="flex w-full flex-col gap-2" data-testid="message-editor">
	<Textarea
		bind:ref={textareaRef}
		bind:value={draft}
		class={cn(
			'w-full resize-none overflow-hidden rounded-xl bg-transparent !text-base outline-none'
		)}
		rows={1}
		autofocus
		oninput={autosize}
		onkeydown={(e) => {
			if (e.key === 'Enter' && e.shiftKey && !e.isComposing) {
				e.preventDefault();
				save();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				cancel();
			}
		}}
	/>

	<div class="flex flex-row justify-end gap-2">
		<Button variant="outline" class="h-fit px-3 py-2" onclick={cancel}>Cancel</Button>
		<Button
			variant="default"
			class="h-fit px-3 py-2"
			data-testid="message-editor-send-button"
			onclick={save}
			disabled={isSubmitting || draft.trim().length === 0}
		>
			{isSubmitting ? 'Saving...' : 'Save'}
		</Button>
	</div>
</div>
