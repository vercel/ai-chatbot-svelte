import { Dialog as SheetPrimitive } from 'bits-ui';
import SheetOverlay from './sheet-overlay.svelte';
import SheetContent from './sheet-content.svelte';
import SheetHeader from './sheet-header.svelte';
import SheetFooter from './sheet-footer.svelte';
import SheetTitle from './sheet-title.svelte';
import SheetDescription from './sheet-description.svelte';
import type { ComponentProps } from 'svelte';

const Root = SheetPrimitive.Root;
type SheetProps = ComponentProps<typeof SheetPrimitive.Root>;
const Close = SheetPrimitive.Close;
type CloseProps = ComponentProps<typeof SheetPrimitive.Close>;
const Trigger = SheetPrimitive.Trigger;
type TriggerProps = ComponentProps<typeof SheetPrimitive.Trigger>;
const Portal = SheetPrimitive.Portal;
type SheetPortalProps = ComponentProps<typeof SheetPrimitive.Portal>;
type SheetOverlayProps = ComponentProps<typeof SheetOverlay>;
type SheetContentProps = ComponentProps<typeof SheetContent>;
type SheetHeaderProps = ComponentProps<typeof SheetHeader>;
type SheetFooterProps = ComponentProps<typeof SheetFooter>;
type SheetTitleProps = ComponentProps<typeof SheetTitle>;
type SheetDescriptionProps = ComponentProps<typeof SheetDescription>;
// TODO regenerate this (and probably the other components too) but keep the new type exports
export {
	Root as Sheet,
	type SheetProps,
	Close as SheetClose,
	type CloseProps,
	Trigger as SheetTrigger,
	type TriggerProps,
	Portal as SheetPortal,
	type SheetPortalProps,
	SheetOverlay,
	type SheetOverlayProps,
	SheetContent,
	type SheetContentProps,
	SheetHeader,
	type SheetHeaderProps,
	SheetFooter,
	type SheetFooterProps,
	SheetTitle,
	type SheetTitleProps,
	SheetDescription,
	type SheetDescriptionProps
};
