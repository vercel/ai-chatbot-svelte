<script lang="ts">
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';

	let { data, children } = $props();
</script>

<SidebarProvider open={!data.sidebarCollapsed}>
	<AppSidebar user={session?.user} />
	<SidebarInset>{@render children?.()}</SidebarInset>
</SidebarProvider>
