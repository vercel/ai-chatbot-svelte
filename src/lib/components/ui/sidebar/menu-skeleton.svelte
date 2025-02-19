<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { WithElementRef } from '$lib/utils/types.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Skeleton } from '../skeleton';

	let {
		showIcon = false,
		class: c,
		children,
		ref = $bindable(null),
		...rest
	}: WithElementRef<
		{ showIcon?: boolean } & HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	> = $props();

	/** A random width between 50% and 90%. */
	const width = `${Math.floor(Math.random() * 40) + 50}%`;
</script>

<div
	data-sidebar="menu-skeleton"
	class={cn('flex h-8 items-center gap-2 rounded-md px-2', c)}
	bind:this={ref}
	{...rest}
>
	{#if showIcon}
		<Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
	{/if}

	<Skeleton
		class="h-4 max-w-[--skeleton-width] flex-1"
		data-sidebar="menu-skeleton-text"
		style="--skeleton-width: {width};"
	/>
</div>
