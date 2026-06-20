import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-primary text-primary-foreground shadow-neumorph-inner': variant === 'default',
          'bg-secondary text-secondary-foreground shadow-neumorph-inner': variant === 'secondary',
          'bg-background text-foreground shadow-neumorph': variant === 'outline',
          'bg-background text-destructive shadow-neumorph-inner': variant === 'destructive',
          'bg-background text-green-700 shadow-neumorph-inner': variant === 'success',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
