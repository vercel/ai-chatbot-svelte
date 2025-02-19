<script lang="ts">
	import { BREAKPOINTS } from '$lib/utils/constants';
	import type { HTMLAttributes } from 'svelte/elements';
	import { MediaQuery } from 'svelte/reactivity';
	import {
		SIDEBAR_COOKIE_MAX_AGE,
		SIDEBAR_COOKIE_NAME,
		SIDEBAR_KEYBOARD_SHORTCUT,
		SIDEBAR_WIDTH,
		SIDEBAR_WIDTH_ICON
	} from './constants';
	import { setSidebarContext } from './context';
	import { cn } from '$lib/utils/shadcn';
	import { TooltipProvider } from '../tooltip';

	let {
		open = $bindable(false),
		children,
		style,
		class: c,
		ref = $bindable(null),
		...rest
	}: {
		open?: boolean;
		ref?: HTMLDivElement | null;
	} & HTMLAttributes<HTMLDivElement> = $props();

	const isMobile = new MediaQuery(
		`(max-width: ${BREAKPOINTS.md.value - 1}${BREAKPOINTS.md.unit})`,
		false
	);

	/** Used to set `data-state`, which makes styling with Tailwind easier */
	const state = $derived(open ? 'expanded' : 'collapsed');

	setSidebarContext({
		get open() {
			return open;
		},
		set open(v) {
			open = v;
		},
		get state() {
			return state;
		},
		get isMobile() {
			return isMobile.current;
		},
		setOpenMobile: (v) => {
			if (isMobile.current) {
				open = v;
			}
		}
	});

	function handleKeyboardToggle(event: KeyboardEvent) {
		if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			open = !open;
		}
	}

	$effect(() => {
		if (isMobile.current) {
			return;
		}
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	});
</script>

<svelte:window onkeydown={handleKeyboardToggle} />

<TooltipProvider delayDuration={0}>
	<div
		style="
      --sidebar-width: {SIDEBAR_WIDTH};
      --sidebar-width-icon: {SIDEBAR_WIDTH_ICON};
      {style}
    "
		class={cn(
			'group/sidebar-wrapper has-[[data-variant=inset]]:bg-sidebar flex min-h-svh w-full',
			c
		)}
		{...rest}
		bind:this={ref}
	>
		{@render children?.()}
	</div>
</TooltipProvider>
