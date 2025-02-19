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
	data-sidebar="menu-badge"
	class={cn(
		'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums',
		'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
		'peer-data-[size=sm]/menu-button:top-1',
		'peer-data-[size=default]/menu-button:top-1.5',
		'peer-data-[size=lg]/menu-button:top-2.5',
		'group-data-[collapsible=icon]:hidden',
		c
	)}
	bind:this={ref}
	{...rest}
>
	{@render children?.()}
</div>
