'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FormFieldDef, FormTheme, FieldType, FIELD_TYPES } from '@/types'
import { FieldPalette } from './FieldPalette'
import { FieldCanvas } from './FieldCanvas'
import { FieldEditor } from './FieldEditor'
import { Button } from '@/components/ui/Button'
import { Save, Globe, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface FormBuilderProps {
  formId: string
  initialTitle: string
  initialFields: FormFieldDef[]
  initialStatus: string
  initialTheme: FormTheme
  formSlug: string
}

export function FormBuilder({
  formId,
  initialTitle,
  initialFields,
  initialStatus,
  initialTheme,
  formSlug,
}: FormBuilderProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [fields, setFields] = useState<FormFieldDef[]>(initialFields)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [status, setStatus] = useState(initialStatus)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectedField = fields.find(f => f.id === selectedId) || null

  function addField(type: FieldType) {
    const typeInfo = FIELD_TYPES.find(f => f.type === type)
    const newField: FormFieldDef = {
      id: `temp-${Date.now()}-$
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>
          )}

          <Link href={`/forms/${formId}/settings`}>
            <Button variant="outline" size="sm">Settings</Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            loading={saving}
            disabled={saved}
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? 'Saved!' : 'Save'}
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            loading={publishing}
          >
            <Globe className="h-3.5 w-3.5" />
            {status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Field palette */}
        <FieldPalette onAddField={addField} />

        {/* Canvas */}
        <div className="flex flex-1 flex-col bg-secondary/30">
          <FieldCanvas
            fields={fields}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDuplicate={duplicateField}
            onDelete={deleteField}
            onReorder={reorderFields}
          />
        </div>

        {/* Field editor */}
        {selectedField && (
          <FieldEditor
            field={selectedField}
            onChange={updateField}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  )
}
