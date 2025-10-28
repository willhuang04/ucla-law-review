import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  // Apply inline CSS variable based styles for key variants so runtime
  // theme variable changes (via the `.dark` class) always affect the
  // button background/text regardless of Tailwind build ordering.
  const inlineStyle: React.CSSProperties = React.useMemo(() => {
    const v = variant || "default";
    switch (v) {
      case "default":
        return {
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
        };
      case "outline":
        return {
          backgroundColor: "var(--color-background)",
          color: "var(--color-foreground)",
          borderColor: "var(--color-border)",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: "var(--color-foreground)",
        };
      case "secondary":
        return {
          backgroundColor: "var(--color-secondary)",
          color: "var(--color-secondary-foreground)",
        };
      default:
        return {};
    }
  }, [variant]);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={{ ...(props as any).style, ...inlineStyle }}
      {...props}
    />
  );
}

export { Button, buttonVariants };
