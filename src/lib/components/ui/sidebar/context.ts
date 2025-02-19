import { getContext, setContext } from 'svelte';

export type SidebarContext = {
	open: boolean;
	readonly state: 'expanded' | 'collapsed';
	readonly isMobile: boolean;
	setOpenMobile: (open: boolean) => void;
};

const sidebarContextKey = Symbol('sidebar');

export function setSidebarContext(context: SidebarContext) {
	setContext(sidebarContextKey, context);
}

export function getSidebarContext(): SidebarContext {
	return getContext(sidebarContextKey);
}
