import { Tooltip as TooltipPrimitive } from 'bits-ui';
import TooltipContent from './tooltip-content.svelte';
import type { ComponentProps } from 'svelte';

const Tooltip = TooltipPrimitive.Root;
type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root>;
const TooltipTrigger = TooltipPrimitive.Trigger;
type TooltipTriggerProps = ComponentProps<typeof TooltipPrimitive.Trigger>;
const TooltipProvider = TooltipPrimitive.Provider;
type TooltipProviderProps = ComponentProps<typeof TooltipPrimitive.Provider>;

type TooltipContentProps = ComponentProps<typeof TooltipContent>;

export {
	Tooltip,
	type TooltipProps,
	TooltipContent,
	type TooltipContentProps,
	TooltipTrigger,
	type TooltipTriggerProps,
	TooltipProvider,
	type TooltipProviderProps
};
