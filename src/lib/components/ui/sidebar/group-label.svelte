<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { WithElementRefAndChild } from '$lib/utils/types';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: c,
		child,
		children,
		ref = $bindable(null),
		...rest
	}: WithElementRefAndChild<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = $props();

	const computedProps = $derived({
		class: cn(
			'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
			'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
			c
		),
		'data-sidebar': 'group-label'
	});
</script>

{#if child}
	{@render child({ props: { ...computedProps, ...rest } })}
{:else}
	<div bind:this={ref} {...computedProps} {...rest}>
		{@render children?.()}
	</div>
{/if}
