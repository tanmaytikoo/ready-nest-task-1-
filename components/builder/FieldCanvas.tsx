import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { FormFieldDef } from '@/types'
import { FieldItem } from './FieldItem'
import { MousePointerClick } from 'lucide-react'

interface FieldCanvasProps {
  fields: FormFieldDef[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onReorder: (fields: FormFieldDef[]) => void
}

export function FieldCanvas({
  fields,
  selectedId,
  onSelect,
  onDuplicate,
  onDelete,
  onReorder,
}: FieldCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = fields.findIndex(f => f.id === active.id)
    const newIndex = fields.findIndex(f => f.id === over.id)
    const reordered = arrayMove(fields, oldIndex, newIndex).map((f, i) => ({ ...f, order: i }))
    onReorder(reordered)
  }

  if (fields.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
            <MousePointerClick className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No fields yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Click a field type from the left panel to add it</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {fields.map(field => (
            <FieldItem
              key={field.id}
              field={field}
              isSelected={selectedId === field.id}
              onSelect={() => onSelect(field.id)}
              onDuplicate={() => onDuplicate(field.id)}
              onDelete={() => onDelete(field.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
