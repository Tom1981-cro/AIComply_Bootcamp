import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        default: "rounded-full bg-primary/10 px-2.5 py-0.5 text-primary",
        solid: "rounded-full bg-primary px-2.5 py-0.5 text-primary-foreground",
        accent: "rounded-full bg-accent/15 px-2.5 py-0.5 text-foreground",
        muted: "rounded-full border border-border px-2.5 py-0.5 text-muted-foreground",
        bare: "text-accent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
