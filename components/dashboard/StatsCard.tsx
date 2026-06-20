import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  description?: string
  icon?: LucideIcon
}

export function StatsCard({ label, value, description, icon: Icon }: StatsCardProps) {
  return (
    <div className="rounded-2xl bg-background p-5 shadow-neumorph transition-all hover:shadow-neumorph-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</h3>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-neumorph-inner text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
