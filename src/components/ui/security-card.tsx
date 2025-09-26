import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border-border glass-card",
        critical: "bg-card border-critical/50 glow-critical pulse-critical",
        warning: "bg-card border-warning/50 glow-warning",
        success: "bg-card border-success/50 glow-success",
        primary: "bg-card border-primary/50 glow-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SecurityCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const SecurityCard = React.forwardRef<HTMLDivElement, SecurityCardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
SecurityCard.displayName = "SecurityCard"

const SecurityCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
SecurityCardHeader.displayName = "SecurityCardHeader"

const SecurityCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
SecurityCardTitle.displayName = "SecurityCardTitle"

const SecurityCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SecurityCardDescription.displayName = "SecurityCardDescription"

const SecurityCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
SecurityCardContent.displayName = "SecurityCardContent"

const SecurityCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
SecurityCardFooter.displayName = "SecurityCardFooter"

export {
  SecurityCard,
  SecurityCardHeader,
  SecurityCardTitle,
  SecurityCardDescription,
  SecurityCardContent,
  SecurityCardFooter,
}