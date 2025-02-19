<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { WithElementRefAndChild } from '$lib/utils/types';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		class: c,
		child,
		children,
		ref = $bindable(null),
		...rest
	}: WithElementRefAndChild<HTMLButtonAttributes, HTMLButtonElement> = $props();

	const computedProps = $derived({
		class: cn(
			'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
			// Increases the hit area of the button on mobile.
			'after:absolute after:-inset-2 after:md:hidden',
			'group-data-[collapsible=icon]:hidden',
			c
		),
		'data-sidebar': 'group-action'
	});
</script>

{#if child}
	{@render child({ props: { ...computedProps, ...rest } })}
{:else}
	<button bind:this={ref} {...computedProps} {...rest}>
		{@render children?.()}
	</button>
{/if}
