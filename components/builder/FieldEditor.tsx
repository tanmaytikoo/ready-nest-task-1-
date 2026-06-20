import { FormFieldDef, FieldType } from '@/types'
import { Input } from '@/components/ui/Input'
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FieldEditorProps {
  field: FormFieldDef
  onChange: (updated: FormFieldDef) => void
  onClose: () => void
}

const OPTION_FIELD_TYPES: FieldType[] = ['dropdown', 'radio', 'checkbox']
const TEXT_FIELD_TYPES: FieldType[] = ['short_text', 'long_text', 'email', 'phone', 'url', 'password']
const NUMBER_FIELD_TYPES: FieldType[] = ['number', 'rating']

export function FieldEditor({ field, onChange, onClose }: FieldEditorProps) {
  function update(patch: Partial<FormFieldDef>) {
    onChange({ ...field, ...patch })
  }

  function updateValidation(patch: Partial<NonNullable<FormFieldDef['validation']>>) {
    onChange({ ...field, validation: { ...field.validation, ...patch } })
  }

  const hasOptions = OPTION_FIELD_TYPES.includes(field.type)
  const isText = TEXT_FIELD_TYPES.includes(field.type)
  const isNumber = NUMBER_FIELD_TYPES.includes(field.type)
  const isStructural = field.type === 'divider'

  const options = field.options || []

  function addOption() {
    update({ options: [...options, `Option ${options.length + 1}`] })
  }

  function updateOption(i: number, value: string) {
    const newOptions = [...options]
    newOptions[i] = value
    update({ options: newOptions })
  }

  function removeOpti
              <Input
                label="Max"
                type="number"
                value={field.validation?.maxLength?.toString() || ''}
                onChange={e => updateValidation({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                id={`max-${field.id}`}
              />
            </div>
          </div>
        )}

        {/* Validation: number range */}
        {isNumber && field.type !== 'rating' && (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Range</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Min"
                type="number"
                value={field.validation?.min?.toString() || ''}
                onChange={e => updateValidation({ min: e.target.value ? parseInt(e.target.value) : undefined })}
                id={`nummin-${field.id}`}
              />
              <Input
                label="Max"
                type="number"
                value={field.validation?.max?.toString() || ''}
                onChange={e => updateValidation({ max: e.target.value ? parseInt(e.target.value) : undefined })}
                id={`nummax-${field.id}`}
              />
            </div>
          </div>
        )}

        {/* Custom error message */}
        {field.type !== 'heading' && (
          <Input
            label="Custom Error Message"
            value={field.validation?.errorMessage || ''}
            onChange={e => updateValidation({ errorMessage: e.target.value })}
            placeholder="e.g. This field is required"
            id={`errmsg-${field.id}`}
          />
        )}
      </div>
    </aside>
  )
}
