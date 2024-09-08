import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-4xl font-bold tracking-tight text-foreground sm:text-6xl',
      h2: 'text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
      h3: 'text-2xl font-bold tracking-tight text-foreground sm:text-3xl',
      h6: 'text-base font-semibold text-accent',
      p: 'text-base text-muted-foreground',
      span: 'text-sm text-foreground hover:text-foreground/70',
      small: 'text-sm font-semibold text-foreground/50',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'h6' | 'p' | 'span' | 'small'
}

const Typography = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, variant = 'p', as, asChild, ...props }, ref) => {
    const Comp = as || (asChild ? Slot : (variant ?? 'p'))

    return (
      <Comp
        className={cn(typographyVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)

Typography.displayName = 'Typography'

export { Typography, typographyVariants }
