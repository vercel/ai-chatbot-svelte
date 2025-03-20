<script lang="ts">
	import { cn } from '$lib/utils/shadcn';

	let { children, ...rest } = $props();
</script>

<h2 {...rest} class={cn('mb-2 mt-6 text-2xl font-semibold', rest.class)}>
	{@render children?.()}
</h2>
