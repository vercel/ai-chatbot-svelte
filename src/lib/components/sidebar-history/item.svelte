<script lang="ts">
	import type { Chat } from '$lib/server/db/schema';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSub,
		DropdownMenuSubContent,
		DropdownMenuSubTrigger,
		DropdownMenuTrigger
	} from '../ui/dropdown-menu';
	import { useSidebar, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
	import TrashIcon from '../icons/trash.svelte';
	import GlobeIcon from '../icons/globe.svelte';
	import CheckCircleFillIcon from '../icons/check-circle-fill.svelte';
	import LockIcon from '../icons/lock.svelte';
	import ShareIcon from '../icons/share.svelte';
	import MoreHorizontalIcon from '../icons/more-horizontal.svelte';
	import { goto } from '$app/navigation';

	let {
		chat,
		active,
		ondelete
	}: {
		chat: Chat;
		active: boolean;
		ondelete: (chatId: string) => void;
	} = $props();

	const context = useSidebar();

	// TODO: actually make this do something
	let visibilityType: 'private' | 'public' = $state('private');
	const setVisibilityType = (type: 'private' | 'public') => {
		visibilityType = type;
	};
</script>

<SidebarMenuItem>
	<SidebarMenuButton isActive={active}>
		{#snippet child({ props })}
			<button
				{...props}
				onclick={() => {
					goto(`/chat/${chat.id}`);
					context.setOpenMobile(false);
				}}
			>
				<span>{chat.title}</span>
			</button>
		{/snippet}
	</SidebarMenuButton>

	<DropdownMenu>
		<DropdownMenuTrigger>
			{#snippet child({ props })}
				<SidebarMenuAction
					{...props}
					class="mr-0.5 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					showOnHover={!active}
				>
					<MoreHorizontalIcon />
					<span class="sr-only">More</span>
				</SidebarMenuAction>
			{/snippet}
		</DropdownMenuTrigger>

		<DropdownMenuContent side="bottom" align="end">
			<DropdownMenuSub>
				<DropdownMenuSubTrigger class="cursor-pointer">
					<ShareIcon />
					<span>Share</span>
				</DropdownMenuSubTrigger>
				<DropdownMenu>
					<DropdownMenuSubContent>
						<DropdownMenuItem
							class="cursor-pointer flex-row justify-between"
							onclick={() => {
								setVisibilityType('private');
							}}
						>
							<div class="flex flex-row items-center gap-2">
								<LockIcon size={12} />
								<span>Private</span>
							</div>
							{#if visibilityType === 'private'}
								<CheckCircleFillIcon />
							{/if}
						</DropdownMenuItem>
						<DropdownMenuItem
							class="cursor-pointer flex-row justify-between"
							onclick={() => {
								setVisibilityType('public');
							}}
						>
							<div class="flex flex-row items-center gap-2">
								<GlobeIcon />
								<span>Public</span>
							</div>
							{#if visibilityType === 'public'}
								<CheckCircleFillIcon />
							{/if}
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenu>
			</DropdownMenuSub>

			<DropdownMenuItem
				class="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
				onclick={() => ondelete(chat.id)}
			>
				<TrashIcon />
				<span>Delete</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</SidebarMenuItem>
