import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn("peer inline-flex h-6 w-11 rounded-full border-2", className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className={cn("block h-5 w-5 rounded-full bg-background")} />
  </SwitchPrimitive.Root>
));
