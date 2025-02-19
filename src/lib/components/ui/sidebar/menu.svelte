<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { WithElementRef } from '$lib/utils/types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: c,
		children,
		ref = $bindable(null),
		...rest
	}: WithElementRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement> = $props();
</script>

<ul
	data-sidebar="menu"
	class={cn('flex w-full min-w-0 flex-col gap-1', c)}
	bind:this={ref}
	{...rest}
>
	{@render children?.()}
</ul>
