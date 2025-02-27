<script lang="ts">
	import ChatItem from './item.svelte';
	import type { Chat, User } from '$lib/server/db/schema';
	import { useSidebar, SidebarGroup, SidebarGroupContent, SidebarMenu } from '../ui/sidebar';
	import { page } from '$app/state';
	import { subWeeks, subMonths, isToday, isYesterday } from 'date-fns';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '../ui/alert-dialog';

	let { user }: { user?: User } = $props();

	let loading = $state(false); // TODO
	let history = $state([]); // TODO
	let alertDialogOpen = $state(false);
	const context = useSidebar();
	const groupedChats = $derived(groupChatsByDate(history));

	type GroupedChats = {
		today: Chat[];
		yesterday: Chat[];
		lastWeek: Chat[];
		lastMonth: Chat[];
		older: Chat[];
	};
	const chatGroupTitles = {
		today: 'Today',
		yesterday: 'Yesterday',
		lastWeek: 'Last 7 days',
		lastMonth: 'Last 30 days',
		older: 'Older'
	} as const;

	function groupChatsByDate(chats: Chat[]): GroupedChats {
		const now = new Date();
		const oneWeekAgo = subWeeks(now, 1);
		const oneMonthAgo = subMonths(now, 1);

		return chats.reduce(
			(groups, chat) => {
				const chatDate = new Date(chat.createdAt);

				if (isToday(chatDate)) {
					groups.today.push(chat);
				} else if (isYesterday(chatDate)) {
					groups.yesterday.push(chat);
				} else if (chatDate > oneWeekAgo) {
					groups.lastWeek.push(chat);
				} else if (chatDate > oneMonthAgo) {
					groups.lastMonth.push(chat);
				} else {
					groups.older.push(chat);
				}

				return groups;
			},
			{
				today: [],
				yesterday: [],
				lastWeek: [],
				lastMonth: [],
				older: []
			} as GroupedChats
		);
	}
</script>

{#if !user}
	<SidebarGroup>
		<SidebarGroupContent>
			<div
				class="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500"
			>
				Login to save and revisit previous chats!
			</div>
		</SidebarGroupContent>
	</SidebarGroup>
{:else if loading}
	<SidebarGroup>
		<div class="px-2 py-1 text-xs text-sidebar-foreground/50">Today</div>
		<SidebarGroupContent>
			<div class="flex flex-col">
				{#each [44, 32, 28, 64, 52] as item (item)}
					<div class="flex h-8 items-center gap-2 rounded-md px-2">
						<div
							class="h-4 max-w-[--skeleton-width] flex-1 rounded-md bg-sidebar-accent-foreground/10"
							style="--skeleton-width': {item}%"
						></div>
					</div>
				{/each}
			</div>
		</SidebarGroupContent>
	</SidebarGroup>
{:else if history.length === 0}
	<SidebarGroup>
		<SidebarGroupContent>
			<div
				class="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500"
			>
				Your conversations will appear here once you start chatting!
			</div>
		</SidebarGroupContent>
	</SidebarGroup>
{:else}
	<SidebarGroup>
		<SidebarGroupContent>
			<SidebarMenu>
				{#each Object.entries(groupedChats) as [group, chats] (group)}
					{#if chats.length > 0}
						<div class="px-2 py-1 text-xs text-sidebar-foreground/50">
							{chatGroupTitles[group as keyof typeof chatGroupTitles]}
						</div>
						{#each chats as chat (chat.id)}
							<ChatItem
								{chat}
								isActive={chat.id === page.params.chatId}
								ondelete={(chatId) => {
									// TODO
									// setDeleteId(chatId);
									// setShowDeleteDialog(true);
									alertDialogOpen = true;
								}}
							/>
						{/each}
					{/if}
				{/each}
			</SidebarMenu>
		</SidebarGroupContent>
	</SidebarGroup>
	<AlertDialog bind:open={alertDialogOpen}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete your chat and remove it from
					our servers.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<!-- TODO -->
				<AlertDialogAction onclick={() => console.log('deleted')}>Continue</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
{/if}
