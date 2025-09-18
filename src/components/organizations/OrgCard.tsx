import * as React from "react"
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/hooks/useAccessibility"

const OrgCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { getAccessibilityClasses } = useAccessibility();
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border shadow-sm bg-purple-900/65 backdrop-blur-sm border-purple-300/20 text-white",
        getAccessibilityClasses('card'),
        className
      )}
      {...props}
    />
  )
})
OrgCard.displayName = "OrgCard"

const OrgCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
OrgCardHeader.displayName = "OrgCardHeader"

const OrgCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { getAccessibilityClasses } = useAccessibility();
  
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-white",
        getAccessibilityClasses('text'),
        className
      )}
      {...props}
    />
  )
})
OrgCardTitle.displayName = "OrgCardTitle"

const OrgCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { getAccessibilityClasses } = useAccessibility();
  
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm text-purple-200",
        getAccessibilityClasses('text'),
        className
      )}
      {...props}
    />
  )
})
OrgCardDescription.displayName = "OrgCardDescription"

const OrgCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
OrgCardContent.displayName = "OrgCardContent"

const OrgCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
OrgCardFooter.displayName = "OrgCardFooter"

export { OrgCard, OrgCardHeader, OrgCardFooter, OrgCardTitle, OrgCardDescription, OrgCardContent }