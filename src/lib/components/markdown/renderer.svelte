<script lang="ts">
	import Markdown, { type ComponentsMap } from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import Ol from './ol.svelte';
	import Li from './li.svelte';
	import Ul from './ul.svelte';
	import Strong from './strong.svelte';
	import A from './a.svelte';
	import H1 from './h1.svelte';
	import H2 from './h2.svelte';
	import H3 from './h3.svelte';
	import H4 from './h4.svelte';
	import H5 from './h5.svelte';
	import H6 from './h6.svelte';
	import CodeBlock from '../code-block.svelte';
	let { md }: { md: string } = $props();

	const renderer: ComponentsMap = {
		code: CodeBlock,
		ol: Ol,
		li: Li,
		ul: Ul,
		strong: Strong,
		a: A,
		h1: H1,
		h2: H2,
		h3: H3,
		h4: H4,
		h5: H5,
		h6: H6
	};
</script>

<Markdown {md} plugins={[gfmPlugin(), { renderer }]} />
