"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  [
    "liquid-glass-button group/liquid relative isolate inline-flex w-fit max-w-full shrink-0 items-center justify-center overflow-hidden text-center",
    "text-text-primary",
    "disabled:pointer-events-none disabled:opacity-45",
  ],
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        compact:
          "min-h-[clamp(3.5rem,5.2vw,4rem)] gap-4 px-[clamp(1.5rem,3vw,2rem)] text-[clamp(1rem,1.12vw,1.125rem)] font-normal uppercase leading-none tracking-[0.105em]",
        default:
          "min-h-[clamp(3.5rem,5.8vw,4.5rem)] gap-5 px-[clamp(1.5rem,3.4vw,2.625rem)] text-[clamp(1rem,1.35vw,1.375rem)] font-normal uppercase leading-none tracking-[0.105em]",
        large:
          "min-h-[clamp(3.875rem,6.2vw,4.75rem)] gap-5 px-[clamp(1.75rem,3.8vw,2.875rem)] text-[clamp(1.0625rem,1.5vw,1.5rem)] font-normal uppercase leading-none tracking-[0.105em]",
      },
      variant: {
        default: "",
        quiet: "liquid-glass-button--quiet",
        technical: "liquid-glass-button--technical",
      },
    },
  },
);

type LiquidGlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof liquidGlassButtonVariants> & {
    asChild?: boolean;
  };

export const LiquidGlassButton = forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(
  (
    {
      asChild = false,
      className,
      children,
      size,
      variant,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(liquidGlassButtonVariants({ size, variant }), className)}
        style={style}
        {...props}
      >
        <span
          className="liquid-glass-button__field"
          aria-hidden="true"
        />
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);

LiquidGlassButton.displayName = "LiquidGlassButton";

export { liquidGlassButtonVariants };
