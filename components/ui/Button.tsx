import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "default" | "lg";
  block?: boolean;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", block, children, href, ...props }, ref) => {
    const classes = cn(
      "btn",
      {
        "btn--primary": variant === "primary",
        "btn--outline": variant === "outline",
        "btn--ghost": variant === "ghost",
        "btn--danger": variant === "danger",
        "btn--sm": size === "sm",
        "btn--lg": size === "lg",
          "btn--block": block === true,
      },
      className
    );

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
