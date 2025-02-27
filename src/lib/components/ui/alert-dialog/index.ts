import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
import AlertDialogTitle from './alert-dialog-title.svelte';
import AlertDialogAction from './alert-dialog-action.svelte';
import AlertDialogCancel from './alert-dialog-cancel.svelte';
import AlertDialogFooter from './alert-dialog-footer.svelte';
import AlertDialogHeader from './alert-dialog-header.svelte';
import AlertDialogOverlay from './alert-dialog-overlay.svelte';
import AlertDialogContent from './alert-dialog-content.svelte';
import AlertDialogDescription from './alert-dialog-description.svelte';
import type { ComponentProps } from 'svelte';

const AlertDialog = AlertDialogPrimitive.Root;
type AlertDialogProps = ComponentProps<typeof AlertDialog>;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
type AlertDialogTriggerProps = ComponentProps<typeof AlertDialogTrigger>;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
type AlertDialogPortalProps = ComponentProps<typeof AlertDialogPortal>;

type AlertDialogTitleProps = ComponentProps<typeof AlertDialogTitle>;
type AlertDialogActionProps = ComponentProps<typeof AlertDialogAction>;
type AlertDialogCancelProps = ComponentProps<typeof AlertDialogCancel>;
type AlertDialogFooterProps = ComponentProps<typeof AlertDialogFooter>;
type AlertDialogHeaderProps = ComponentProps<typeof AlertDialogHeader>;
type AlertDialogOverlayProps = ComponentProps<typeof AlertDialogOverlay>;
type AlertDialogContentProps = ComponentProps<typeof AlertDialogContent>;
type AlertDialogDescriptionProps = ComponentProps<typeof AlertDialogDescription>;

export {
	AlertDialog,
	type AlertDialogProps,
	AlertDialogTitle,
	type AlertDialogTitleProps,
	AlertDialogAction,
	type AlertDialogActionProps,
	AlertDialogCancel,
	type AlertDialogCancelProps,
	AlertDialogPortal,
	type AlertDialogPortalProps,
	AlertDialogFooter,
	type AlertDialogFooterProps,
	AlertDialogHeader,
	type AlertDialogHeaderProps,
	AlertDialogTrigger,
	type AlertDialogTriggerProps,
	AlertDialogOverlay,
	type AlertDialogOverlayProps,
	AlertDialogContent,
	type AlertDialogContentProps,
	AlertDialogDescription,
	type AlertDialogDescriptionProps
};
