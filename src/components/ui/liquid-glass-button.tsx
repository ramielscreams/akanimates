"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useId,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react";

import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  [
    "group/liquid relative isolate inline-flex w-fit max-w-full shrink-0 items-center justify-center overflow-hidden text-center",
    "border border-text-primary/18 bg-surface/12 text-text-primary shadow-[0_0.85rem_2.8rem_rgb(var(--brand-rgb)_/_0.16)]",
    "backdrop-blur-xl backdrop-saturate-150",
    "transition-[transform,background-color,border-color,box-shadow,color,opacity] duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)]",
    "hover:scale-[1.01] hover:border-brand-soft/45 hover:bg-text-highlight/8 hover:text-text-highlight hover:shadow-[0_1.1rem_3.5rem_rgb(var(--brand-interactive-rgb)_/_0.25)]",
    "active:scale-[0.99] active:border-brand-interactive/60 active:bg-brand-interactive/16",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive",
    "disabled:pointer-events-none disabled:opacity-45",
    "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
  ],
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        compact:
          "min-h-10 gap-3 px-4 text-[0.6875rem] font-medium uppercase leading-none tracking-[0.22em]",
        default:
          "min-h-12 gap-4 px-5 text-xs font-medium uppercase leading-none tracking-[0.22em]",
        large:
          "min-h-14 gap-4 px-6 text-xs font-medium uppercase leading-none tracking-[0.24em]",
      },
      variant: {
        default: "",
        quiet:
          "border-border/80 bg-bg/18 text-text-primary/92 shadow-[0_0.75rem_2.25rem_rgb(var(--brand-rgb)_/_0.12)] hover:border-brand-interactive/45 hover:bg-surface/34",
        technical:
          "border-technical/20 shadow-[0_0.85rem_2.8rem_rgb(var(--technical-rgb)_/_0.12)] hover:border-technical/42 hover:shadow-[0_1.1rem_3.5rem_rgb(var(--technical-rgb)_/_0.18)]",
      },
    },
  },
);

type LiquidGlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof liquidGlassButtonVariants> & {
    asChild?: boolean;
  };

function GlassFilter({ id }: { id: string }) {
  return (
    <svg
      className="pointer-events-none absolute size-0"
      aria-hidden="true"
      focusable="false"
    >
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.024"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="6"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

export const LiquidGlassButton = forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(
  (
    { asChild = false, className, children, size, variant, style, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const filterId = useId().replace(/:/g, "");
    const glassFilterId = `liquid-glass-${filterId}`;

    return (
      <Comp
        ref={ref}
        className={cn(liquidGlassButtonVariants({ size, variant }), className)}
        style={style}
        {...props}
      >
        <GlassFilter id={glassFilterId} />
        <span
          className="pointer-events-none absolute inset-0 -z-20 opacity-75"
          style={
            {
              background:
                "linear-gradient(135deg, rgb(var(--text-highlight-rgb) / 0.14), transparent 34%), radial-gradient(circle at 28% 22%, rgb(var(--brand-soft-rgb) / 0.2), transparent 42%), radial-gradient(circle at 72% 86%, rgb(var(--brand-rgb) / 0.3), transparent 48%)",
              filter: `url(#${glassFilterId})`,
            } as CSSProperties
          }
        />
        <span className="pointer-events-none absolute inset-px -z-10 bg-[linear-gradient(115deg,transparent,rgb(var(--text-highlight-rgb)_/_0.16)_36%,transparent_58%)] opacity-35 transition-opacity duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:opacity-60 motion-reduce:transition-none" />
        <span className="pointer-events-none absolute inset-0 -z-10 border border-text-highlight/10 transition-colors duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:border-brand-soft/28 motion-reduce:transition-none" />
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);

LiquidGlassButton.displayName = "LiquidGlassButton";

export { liquidGlassButtonVariants };
