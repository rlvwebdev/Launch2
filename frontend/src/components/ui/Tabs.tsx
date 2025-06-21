import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

// Professional tabs list variants
const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-md bg-neutral-100 p-1 text-neutral-500",
  {
    variants: {
      variant: {
        default: "bg-neutral-100",
        bordered: "bg-transparent border border-neutral-200",
        underline: "bg-transparent border-b border-neutral-200 rounded-none p-0",
        pills: "bg-neutral-50 p-1",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default", 
      size: "md",
    },
  }
)

// Professional tab trigger variants
const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-launch-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm",
        bordered: "border border-transparent data-[state=active]:border-launch-200 data-[state=active]:bg-white data-[state=active]:text-launch-900",
        underline: "border-b-2 border-transparent data-[state=active]:border-launch-600 data-[state=active]:text-launch-900 rounded-none px-4 py-3",
        pills: "data-[state=active]:bg-launch-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-neutral-100",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & 
  VariantProps<typeof tabsListVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & 
  VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-launch-500 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
