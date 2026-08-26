"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  [
    "liquid-glass-button group/liquid relative isolate inline-flex w-fit max-w-full shrink-0 items-center justify-center overflow-hidden text-center",
    "rounded-[var(--radius-button)] border border-border bg-surface text-text-primary",
    "transition-[background-color,border-color,color,opacity,transform] duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)]",
    "hover:border-brand-interactive/70 hover:text-text-highlight",
    "active:scale-[0.98] active:border-brand-interactive/80 active:bg-brand/30 active:text-text-highlight",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive",
    "disabled:pointer-events-none disabled:opacity-45",
    "motion-reduce:transition-none",
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
        quiet:
          "border-border/80 bg-bg text-text-primary/92 hover:border-brand-interactive/55 hover:bg-surface",
        technical:
          "border-border bg-surface text-text-primary hover:border-brand-interactive/70",
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
      onPointerEnter,
      onPointerLeave,
      onPointerMove,
      size,
      variant,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const updatePointerPosition = (event: PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();

      target.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    };

    const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
      updatePointerPosition(event);
      onPointerEnter?.(event);
    };

    const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
      updatePointerPosition(event);
      onPointerMove?.(event);
    };

    const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(event);
    };

    return (
      <Comp
        ref={ref}
        className={cn(liquidGlassButtonVariants({ size, variant }), className)}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        style={style}
        {...props}
      >
        <span
          className="liquid-glass-button__field"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(var(--text-highlight-rgb)_/_0.045),transparent_52%)] opacity-75"
          aria-hidden="true"
        />
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);

LiquidGlassButton.displayName = "LiquidGlassButton";

export { liquidGlassButtonVariants };
