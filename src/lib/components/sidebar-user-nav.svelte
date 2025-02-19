<script lang="ts">
	import type { User } from '$lib/server/db/schema';
	import ChevronUp from './icons/chevron-up.svelte';
	import { Button } from './ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from './ui/dropdown-menu';
	import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

	let { user }: { user: User } = $props();
</script>

<SidebarMenu>
	<SidebarMenuItem>
		<DropdownMenu>
			<DropdownMenuTrigger>
				{#snippet child({ props })}
					<SidebarMenuButton
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 bg-background"
						{...props}
					>
						<img
							src={`https://avatar.vercel.sh/${user.email}`}
							alt={user.email ?? 'User Avatar'}
							width={24}
							height={24}
							class="rounded-full"
						/>
						<span class="truncate">{user?.email}</span>
						<ChevronUp class="ml-auto" />
					</SidebarMenuButton>
				{/snippet}
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top" class="TODO w-[--radix-popper-anchor-width]">
				<!-- TODO -- needs work in root layout.tsx plus some other shenanigans -->
				<!-- <DropdownMenuItem
					class="cursor-pointer"
					onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				>
					{`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
				</DropdownMenuItem>
				<DropdownMenuSeparator /> -->
				<DropdownMenuItem>
					{#snippet child({ props })}
						<Button href="/signout" class="w-full cursor-pointer" {...props}>Sign out</Button>
					{/snippet}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</SidebarMenuItem>
</SidebarMenu>
