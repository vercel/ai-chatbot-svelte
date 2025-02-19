<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import { Input, type InputProps } from '../input';

	let { class: c, ref = $bindable(null), value = $bindable(), ...rest }: InputProps = $props();
</script>

<Input
	data-sidebar="input"
	class={cn(
		'focus-visible:ring-sidebar-ring h-8 w-full bg-background shadow-none focus-visible:ring-2',
		c
	)}
	bind:value
	bind:ref
	{...rest}
/>
