import type { ComponentProps } from 'svelte';
import { useSidebar } from './context.svelte.js';
import SidebarContent from './sidebar-content.svelte';
import SidebarFooter from './sidebar-footer.svelte';
import SidebarGroupAction from './sidebar-group-action.svelte';
import SidebarGroupContent from './sidebar-group-content.svelte';
import SidebarGroupLabel from './sidebar-group-label.svelte';
import SidebarGroup from './sidebar-group.svelte';
import SidebarHeader from './sidebar-header.svelte';
import SidebarInput from './sidebar-input.svelte';
import SidebarInset from './sidebar-inset.svelte';
import SidebarMenuAction from './sidebar-menu-action.svelte';
import SidebarMenuBadge from './sidebar-menu-badge.svelte';
import SidebarMenuButton from './sidebar-menu-button.svelte';
import SidebarMenuItem from './sidebar-menu-item.svelte';
import SidebarMenuSkeleton from './sidebar-menu-skeleton.svelte';
import SidebarMenuSubButton from './sidebar-menu-sub-button.svelte';
import SidebarMenuSubItem from './sidebar-menu-sub-item.svelte';
import SidebarMenuSub from './sidebar-menu-sub.svelte';
import SidebarMenu from './sidebar-menu.svelte';
import SidebarProvider from './sidebar-provider.svelte';
import SidebarRail from './sidebar-rail.svelte';
import SidebarSeparator from './sidebar-separator.svelte';
import SidebarTrigger from './sidebar-trigger.svelte';
import Sidebar from './sidebar.svelte';

type SidebarProps = ComponentProps<typeof Sidebar>;
type SidebarContentProps = ComponentProps<typeof SidebarContent>;
type SidebarFooterProps = ComponentProps<typeof SidebarFooter>;
type SidebarGroupProps = ComponentProps<typeof SidebarGroup>;
type SidebarGroupActionProps = ComponentProps<typeof SidebarGroupAction>;
type SidebarGroupContentProps = ComponentProps<typeof SidebarGroupContent>;
type SidebarGroupLabelProps = ComponentProps<typeof SidebarGroupLabel>;
type SidebarHeaderProps = ComponentProps<typeof SidebarHeader>;
type SidebarInputProps = ComponentProps<typeof SidebarInput>;
type SidebarInsetProps = ComponentProps<typeof SidebarInset>;
type SidebarMenuProps = ComponentProps<typeof SidebarMenu>;
type SidebarMenuActionProps = ComponentProps<typeof SidebarMenuAction>;
type SidebarMenuBadgeProps = ComponentProps<typeof SidebarMenuBadge>;
type SidebarMenuButtonProps = ComponentProps<typeof SidebarMenuButton>;
type SidebarMenuItemProps = ComponentProps<typeof SidebarMenuItem>;
type SidebarMenuSkeletonProps = ComponentProps<typeof SidebarMenuSkeleton>;
type SidebarMenuSubProps = ComponentProps<typeof SidebarMenuSub>;
type SidebarMenuSubButtonProps = ComponentProps<typeof SidebarMenuSubButton>;
type SidebarMenuSubItemProps = ComponentProps<typeof SidebarMenuSubItem>;
type SidebarProviderProps = ComponentProps<typeof SidebarProvider>;
type SidebarRailProps = ComponentProps<typeof SidebarRail>;
type SidebarSeparatorProps = ComponentProps<typeof SidebarSeparator>;
type SidebarTriggerProps = ComponentProps<typeof SidebarTrigger>;

export {
	Sidebar,
	type SidebarProps,
	SidebarContent,
	type SidebarContentProps,
	SidebarFooter,
	type SidebarFooterProps,
	SidebarGroup,
	type SidebarGroupProps,
	SidebarGroupAction,
	type SidebarGroupActionProps,
	SidebarGroupContent,
	type SidebarGroupContentProps,
	SidebarGroupLabel,
	type SidebarGroupLabelProps,
	SidebarHeader,
	type SidebarHeaderProps,
	SidebarInput,
	type SidebarInputProps,
	SidebarInset,
	type SidebarInsetProps,
	SidebarMenu,
	type SidebarMenuProps,
	SidebarMenuAction,
	type SidebarMenuActionProps,
	SidebarMenuBadge,
	type SidebarMenuBadgeProps,
	SidebarMenuButton,
	type SidebarMenuButtonProps,
	SidebarMenuItem,
	type SidebarMenuItemProps,
	SidebarMenuSkeleton,
	type SidebarMenuSkeletonProps,
	SidebarMenuSub,
	type SidebarMenuSubProps,
	SidebarMenuSubButton,
	type SidebarMenuSubButtonProps,
	SidebarMenuSubItem,
	type SidebarMenuSubItemProps,
	SidebarProvider,
	type SidebarProviderProps,
	SidebarRail,
	type SidebarRailProps,
	SidebarSeparator,
	type SidebarSeparatorProps,
	SidebarTrigger,
	type SidebarTriggerProps,
	useSidebar
};
