<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import { Separator, type SeparatorProps } from '../separator';

	let { class: c, children, ref = $bindable(null), ...rest }: SeparatorProps = $props();
</script>

<Separator
	data-sidebar="separator"
	class={cn('bg-sidebar-border mx-2 w-auto', c)}
	bind:ref
	{...rest}
/>
