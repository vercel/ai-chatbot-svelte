<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';

	let { data, children } = $props();
</script>

<SidebarProvider open={!data.sidebarCollapsed}>
	<AppSidebar user={data.user} />
	<SidebarInset>{@render children?.()}</SidebarInset>
</SidebarProvider>
