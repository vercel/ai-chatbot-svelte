import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
import DropdownMenuCheckboxItem from './dropdown-menu-checkbox-item.svelte';
import DropdownMenuContent from './dropdown-menu-content.svelte';
import DropdownMenuGroupHeading from './dropdown-menu-group-heading.svelte';
import DropdownMenuItem from './dropdown-menu-item.svelte';
import DropdownMenuLabel from './dropdown-menu-label.svelte';
import DropdownMenuRadioItem from './dropdown-menu-radio-item.svelte';
import DropdownMenuSeparator from './dropdown-menu-separator.svelte';
import DropdownMenuShortcut from './dropdown-menu-shortcut.svelte';
import DropdownMenuSubContent from './dropdown-menu-sub-content.svelte';
import DropdownMenuSubTrigger from './dropdown-menu-sub-trigger.svelte';
import type { ComponentProps } from 'svelte';

const DropdownMenuSub = DropdownMenuPrimitive.Sub;
type DropdownMenuSubProps = ComponentProps<typeof DropdownMenuSub>;
const DropdownMenu = DropdownMenuPrimitive.Root;
type DropdownMenuProps = ComponentProps<typeof DropdownMenu>;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
type DropdownMenuTriggerProps = ComponentProps<typeof DropdownMenuTrigger>;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
type DropdownMenuGroupProps = ComponentProps<typeof DropdownMenuGroup>;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
type DropdownMenuRadioGroupProps = ComponentProps<typeof DropdownMenuRadioGroup>;

type DropdownMenuCheckboxItemProps = ComponentProps<typeof DropdownMenuCheckboxItem>;
type DropdownMenuContentProps = ComponentProps<typeof DropdownMenuContent>;
type DropdownMenuGroupHeadingProps = ComponentProps<typeof DropdownMenuGroupHeading>;
type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuItem>;
type DropdownMenuLabelProps = ComponentProps<typeof DropdownMenuLabel>;
type DropdownMenuRadioItemProps = ComponentProps<typeof DropdownMenuRadioItem>;
type DropdownMenuSeparatorProps = ComponentProps<typeof DropdownMenuSeparator>;
type DropdownMenuShortcutProps = ComponentProps<typeof DropdownMenuShortcut>;
type DropdownMenuSubContentProps = ComponentProps<typeof DropdownMenuSubContent>;
type DropdownMenuSubTriggerProps = ComponentProps<typeof DropdownMenuSubTrigger>;

export {
	DropdownMenu,
	type DropdownMenuProps,
	DropdownMenuCheckboxItem,
	type DropdownMenuCheckboxItemProps,
	DropdownMenuContent,
	type DropdownMenuContentProps,
	DropdownMenuGroup,
	type DropdownMenuGroupProps,
	DropdownMenuGroupHeading,
	type DropdownMenuGroupHeadingProps,
	DropdownMenuItem,
	type DropdownMenuItemProps,
	DropdownMenuLabel,
	type DropdownMenuLabelProps,
	DropdownMenuRadioGroup,
	type DropdownMenuRadioGroupProps,
	DropdownMenuRadioItem,
	type DropdownMenuRadioItemProps,
	DropdownMenuSeparator,
	type DropdownMenuSeparatorProps,
	DropdownMenuShortcut,
	type DropdownMenuShortcutProps,
	DropdownMenuSub,
	type DropdownMenuSubProps,
	DropdownMenuSubContent,
	type DropdownMenuSubContentProps,
	DropdownMenuSubTrigger,
	type DropdownMenuSubTriggerProps,
	DropdownMenuTrigger,
	type DropdownMenuTriggerProps
};
