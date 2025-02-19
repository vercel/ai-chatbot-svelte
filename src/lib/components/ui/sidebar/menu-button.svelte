<script lang="ts" module>
	import { cn } from '$lib/utils/shadcn';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';
	import { Tooltip, TooltipContent, TooltipTrigger, type TooltipContentProps } from '../tooltip';
	import { getSidebarContext } from './context';
	import type { WithElementRefAndChild } from '$lib/utils/types';

	export const menuButtonVariants = tv({
		base: 'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
		variants: {
			variant: {
				default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
				outline:
					'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]'
			},
			size: {
				default: 'h-8 text-sm',
				sm: 'h-7 text-xs',
				lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type MenuButtonVariant = VariantProps<typeof menuButtonVariants>['variant'];
	export type MenuButtonSize = VariantProps<typeof menuButtonVariants>['size'];

	export type MenuButtonProps = WithElementRefAndChild<HTMLButtonAttributes> & {
		variant?: MenuButtonVariant;
		size?: MenuButtonSize;
		active?: boolean;
		tooltip?: string | TooltipContentProps;
	};
</script>

<script lang="ts">
	let {
		active,
		class: c,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		tooltip,
		child,
		children,
		...rest
	}: MenuButtonProps = $props();

	const context = getSidebarContext();
	const computedProps = $derived({
		'data-sidebar': 'menu-button',
		'data-size': size,
		'data-active': active,
		class: cn(menuButtonVariants({ variant, size }), c)
	});
</script>

{#if tooltip}
	<Tooltip>
		<TooltipTrigger>
			{#snippet child({ props })}
				{@render button(props)}
			{/snippet}
		</TooltipTrigger>
		<TooltipContent
			side="right"
			align="center"
			hidden={context.state !== 'collapsed' || context.isMobile}
			{...typeof tooltip === 'object' ? tooltip : {}}
		>
			{#if typeof tooltip === 'string'}
				{tooltip}
			{:else}
				{@render tooltip.children?.()}
			{/if}
		</TooltipContent>
	</Tooltip>
{:else}
	{@render button()}
{/if}

{#snippet button(passthroughProps?: Record<string, unknown>)}
	{#if child}
		{@render child({ props: { ...computedProps, ...passthroughProps, ...rest } })}
	{:else}
		<button bind:this={ref} {...computedProps} {...passthroughProps} {...rest}>
			{@render children?.()}
		</button>
	{/if}
{/snippet}
