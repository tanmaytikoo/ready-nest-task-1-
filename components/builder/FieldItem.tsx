import { FormFieldDef, FieldType } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Copy, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FieldItemProps {
  field: FormFieldDef
  isSelected: boolean
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function FieldItem({ field, isSelected, onSelect, onDuplicate, onDelete }: FieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (field.type === 'divider') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        onClick={onSelect}
        className={cn(
          'group flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer',
          isSelected ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground/30'
        )}
      >
        <button {...attributes} {...listeners} className="cursor-grab touch-none text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">Divider</span>
        <FieldActions onDuplicate={onDuplicate} onDelete={onDelete} />
      </div>
    )
        isDragging && 'opacity-50'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={e => e.stopPropagation()}
        className="mt-0.5 cursor-grab touch-none text-muted-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-foreground">{field.label || 'Untitled Field'}</span>
          {field.required && <span className="text-destructive text-xs">*</span>}
        </div>
        <span className="text-xs text-muted-foreground capitalize">{field.type.replace('_', ' ')}</span>
        {field.placeholder && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground/60">{field.placeholder}</p>
        )}
      </div>

      <FieldActions onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  )
}

function FieldActions({ onDuplicate, onDelete }: { onDuplicate: () => void; onDelete: () => void }) {
  return (
    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={e => { e.stopPropagation(); onDuplicate() }}
        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        title="Duplicate field"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onDelete() }}
        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        title="Delete field"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
