<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { WithElementRef } from '$lib/utils/types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: c,
		children,
		ref = $bindable(null),
		...rest
	}: WithElementRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement> = $props();
</script>

<ul
	data-sidebar="submenu"
	class={cn(
		'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
		'group-data-[collapsible=icon]:hidden',
		c
	)}
	bind:this={ref}
	{...rest}
>
	{@render children?.()}
</ul>
