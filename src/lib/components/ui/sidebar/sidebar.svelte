<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { getSidebarContext } from './context';
	import { cn } from '$lib/utils/shadcn';
	import { Sheet, SheetContent } from '../sheet';
	import { SIDEBAR_WIDTH_MOBILE } from './constants';

	let {
		side = 'left',
		variant = 'sidebar',
		collapsible = 'offcanvas',
		class: c,
		children,
		ref = $bindable(null),
		...rest
	}: {
		side?: 'left' | 'right';
		variant?: 'sidebar' | 'floating' | 'inset';
		collapsible?: 'offcanvas' | 'icon' | 'none';
		ref?: HTMLDivElement | null;
	} & HTMLAttributes<HTMLDivElement> = $props();

	const context = getSidebarContext();

	if (collapsible === 'none') {
	}
</script>

{#if collapsible === 'none'}
	<div
		class={cn('bg-sidebar text-sidebar-foreground flex h-full w-[--sidebar-width] flex-col', c)}
		bind:this={ref}
		{...rest}
	>
		{@render children?.()}
	</div>
{:else if context.isMobile}
	<Sheet bind:open={context.open}>
		<SheetContent
			data-sidebar="sidebar"
			data-mobile="true"
			class="bg-sidebar text-sidebar-foreground w-[--sidebar-width] p-0 [&>button]:hidden"
			{side}
			style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE}"
		>
			<div class="flex h-full w-full flex-col" bind:this={ref}>{@render children?.()}</div>
		</SheetContent>
	</Sheet>
{:else}
	<div
		class="text-sidebar-foreground group peer hidden md:block"
		data-state={context.state}
		data-collapsible={context.state === 'collapsed' ? collapsible : ''}
		data-variant={variant}
		data-side={side}
		bind:this={ref}
	>
		<!-- This is what handles the sidebar gap on desktop -->
		<div
			class={cn(
				'relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear',
				'group-data-[collapsible=offcanvas]:w-0',
				'group-data-[side=right]:rotate-180',
				variant === 'floating' || variant === 'inset'
					? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
					: 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
			)}
		></div>
		<div
			class={cn(
				'fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex',
				side === 'left'
					? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
					: 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
				// Adjust the padding for floating and inset variants.
				variant === 'floating' || variant === 'inset'
					? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
					: 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
				c
			)}
			{...rest}
		>
			<div
				data-sidebar="sidebar"
				class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow"
			>
				{children}
			</div>
		</div>
	</div>
{/if}
