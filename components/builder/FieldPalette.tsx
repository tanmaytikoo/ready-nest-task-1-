import { FIELD_TYPES, FieldType } from '@/types'
import {
  Type, AlignLeft, Mail, Hash, Phone, Link, Lock,
  ChevronDown, Circle, CheckSquare,
  Calendar, Clock, Star, Upload, Minus, Heading,
  CalendarClock
} from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  Type: <Type className="h-4 w-4" />,
  AlignLeft: <AlignLeft className="h-4 w-4" />,
  Mail: <Mail className="h-4 w-4" />,
  Hash: <Hash className="h-4 w-4" />,
  Phone: <Phone className="h-4 w-4" />,
  Link: <Link className="h-4 w-4" />,
  Lock: <Lock className="h-4 w-4" />,
  ChevronDown: <ChevronDown className="h-4 w-4" />,
  Circle: <Circle className="h-4 w-4" />,
  CheckSquare: <CheckSquare className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  Clock: <Clock className="h-4 w-4" />,
  CalendarClock: <CalendarClock className="h-4 w-4" />,
  Star: <Star className="h-4 w-4" />,
  Upload: <Upload className="h-4 w-4" />,
  Minus: <Minus className="h-4 w-4" />,
  Heading: <Heading className="h-4 w-4" />,
}

const CATEGORIES = [
  { key: 'basic', label: 'Basic Fields' },
  { key: 'selection', label: 'Selection' },
  { key: 'datetime', label: 'Date & Time' },
  { key: 'advanced', label: 'Advanced' },
] as const

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void
}

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <aside className="flex h-full w-52 flex-col border-r border-border bg-background overflow-y-auto">
      <div className="border-b border-border px-3 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fields</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {CATEGORIES.map(cat => (
          <div key={cat.key}>
            <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">{cat.label}</p>
            <div className="space-y-0.5">
              {FIELD_TYPES.filter(f => f.category === cat.key).map(field => (
                <button
                  key={field.type}
                  onClick={() => onAddField(field.type)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  <span className="text-muted-foreground">{ICONS[field.icon]}</span>
                  {field.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
