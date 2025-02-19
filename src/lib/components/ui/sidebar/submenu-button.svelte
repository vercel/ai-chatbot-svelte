<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { WithElementRefAndChild } from '$lib/utils/types';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: c,
		child,
		children,
		size = 'md',
		active,
		ref = $bindable(null),
		...rest
	}: WithElementRefAndChild<
		{
			size?: 'sm' | 'md';
			active?: boolean;
		} & HTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	> = $props();

	const computedProps = $derived({
		class: cn(
			'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
			'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
			size === 'sm' && 'text-xs',
			size === 'md' && 'text-sm',
			'group-data-[collapsible=icon]:hidden',
			c
		),
		'data-sidebar': 'submenu-button',
		'data-size': size,
		'data-active': active
	});
</script>

{#if child}
	{@render child({ props: { ...computedProps, ...rest } })}
{:else}
	<a bind:this={ref} {...computedProps} {...rest}>
		{@render children?.()}
	</a>
{/if}
