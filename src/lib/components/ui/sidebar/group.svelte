<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { WithElementRef } from '$lib/utils/types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: c,
		children,
		ref = $bindable(null),
		...rest
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();
</script>

<div
	data-sidebar="group"
	class={cn('relative flex w-full min-w-0 flex-col p-2', c)}
	bind:this={ref}
	{...rest}
>
	{@render children?.()}
</div>
