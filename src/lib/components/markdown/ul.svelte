<script lang="ts">
	import { cn } from '$lib/utils/shadcn';

	let { children, ...rest } = $props();
</script>

<ul {...rest} class={cn('ml-4 list-outside list-decimal', rest.class)}>
	{@render children?.()}
</ul>
