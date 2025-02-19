<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { WithElementRef } from '$lib/utils/types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: c,
		children,
		ref = $bindable(null),
		...rest
	}: WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement> = $props();
</script>

<li data-sidebar="menu-item" class={cn('group/menu-item relative', c)} bind:this={ref} {...rest}>
	{@render children?.()}
</li>
