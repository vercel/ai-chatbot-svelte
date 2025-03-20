<script lang="ts">
	import LoaderIcon from './icons/loader.svelte';
	import ChevronDownIcon from './icons/chevron-down.svelte';
	import { Markdown } from './markdown';
	let { loading, reasoning }: { loading: boolean; reasoning: string } = $props();
	let expanded = $state(false);
</script>

<div class="flex flex-col">
	{#if loading}
		<div class="flex flex-row items-center gap-2">
			<div class="font-medium">Reasoning</div>
			<div class="animate-spin">
				<LoaderIcon />
			</div>
		</div>
	{:else}
		<div class="flex flex-row items-center gap-2">
			<div class="font-medium">Reasoned for a few seconds</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="cursor-pointer"
				onclick={() => {
					expanded = !expanded;
				}}
			>
				<ChevronDownIcon />
			</div>
		</div>
	{/if}

	<Markdown md={reasoning} />
</div>
