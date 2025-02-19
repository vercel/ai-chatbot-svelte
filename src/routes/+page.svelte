<script lang="ts">
	import MenuButton from '$lib/components/ui/sidebar/menu-button.svelte';
	import { TooltipProvider, type TooltipContentProps } from '$lib/components/ui/tooltip';
	import SidebarProvider from '$lib/components/ui/sidebar/provider.svelte';
	import type { Snippet } from 'svelte';
</script>

<TooltipProvider>
	<SidebarProvider>
		<div class="w-10">
			<MenuButton tooltip={{ child: tooltip }}>Hello</MenuButton>
		</div>
	</SidebarProvider>
</TooltipProvider>

{#snippet tooltip({
	wrapperProps,
	props,
	open
}: Parameters<NonNullable<TooltipContentProps['child']>>[0])}
	{#if open}
		<div {...wrapperProps}>
			<div {...props}>
				<div>Hi</div>
			</div>
		</div>
	{/if}
{/snippet}
