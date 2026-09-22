import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer select-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-emerald-800 to-emerald-950 text-white border-t border-emerald-600/50 shadow-[0_4px_0_#062d1a,0_8px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#062d1a,0_12px_22px_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_1px_0_#062d1a,0_2px_4px_rgba(0,0,0,0.15)]",
        gold: "bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-stone-950 font-bold border-t border-amber-200 shadow-[0_4px_0_#92400e,0_8px_18px_rgba(245,158,11,0.4),inset_0_1px_0_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#92400e,0_14px_26px_rgba(245,158,11,0.55)] active:translate-y-1 active:shadow-[0_1px_0_#92400e,0_2px_6px_rgba(245,158,11,0.3)]",
        destructive:
          "bg-gradient-to-b from-rose-600 to-rose-700 text-white border-t border-rose-400/50 shadow-[0_4px_0_#881337,0_6px_14px_rgba(225,29,72,0.3),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#881337,0_10px_18px_rgba(225,29,72,0.35)] active:translate-y-1 active:shadow-[0_1px_0_#881337]",
        outline:
          "border border-border/90 bg-card text-foreground shadow-[0_3px_0_var(--border),0_5px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:-translate-y-0.5 hover:border-amber-500/60 hover:text-amber-700 dark:hover:text-amber-400 hover:shadow-[0_5px_0_oklch(0.83_0.155_80/0.4),0_8px_16px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-[0_1px_0_var(--border)]",
        secondary:
          "bg-secondary text-secondary-foreground border-t border-white/40 dark:border-white/10 shadow-[0_3px_0_oklch(0.82_0.025_80),0_5px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-0.5 hover:shadow-[0_5px_0_oklch(0.82_0.025_80),0_8px_16px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.82_0.025_80)]",
        glass:
          "bg-white/15 backdrop-blur-md border border-white/35 text-white shadow-[0_4px_0_rgba(0,0,0,0.35),0_8px_18px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.5)] hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.35),0_12px_24px_rgba(0,0,0,0.35)] active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.35)]",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground active:scale-95 transition-all",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8.5 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
