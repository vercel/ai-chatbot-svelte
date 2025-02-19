<script lang="ts">
	import { Button, type ButtonProps } from '../button';
	import { cn } from '$lib/utils/shadcn';
	import { getSidebarContext } from './context';
	import PanelLeft from '$lib/components/icons/panel-left.svelte';

	let { onclick, class: c, ref = $bindable(null), ...rest }: ButtonProps = $props();

	const context = getSidebarContext();
</script>

<Button
	data-sidebar="trigger"
	variant="ghost"
	size="icon"
	class={cn('h-7 w-7', c)}
	onclick={(event) => {
		// @ts-expect-error - stupid overload vs union type stuff
		onclick?.(event);
		context.open = !context.open;
	}}
	bind:ref
	{...rest}
>
	<PanelLeft />
	<span class="sr-only">Toggle sidebar</span>
</Button>
