'use client'

import { useState } from 'react'
import { FormFieldDef, FormTheme } from '@/types'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface PublicFormProps {
  formId: string
  slug: string
  title: string
  description?: string | null
  fields: FormFieldDef[]
  theme: FormTheme
}

type FieldValue = string | string[]

export function PublicForm({ formId, slug, title, description, fields, theme }: PublicFormProps) {
  const [values, setValues] = useState<Record<string, FieldValue>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function setValue(fieldId: string, value: FieldValue) {
    setValues(prev => ({ ...prev, [fieldId]: value }))
    setErrors(prev => ({ ...prev, [fieldId]: '' }))
  }

  function toggleCheckbox(fieldId: string, option: string) {
    const current = (values[fieldId] as string[]) || []
    const next = current.includes(option)
      ? current.filter(v => v !== option)
      : [...current, option]
    setValue(fieldId, next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')

    // Client-side required validation
    const newErrors: Record<string, string> = {}
    fo
              onClick={() => onChange(star.toString())}
              className={`text-2xl transition-colors ${star <= rating ? 'text-gray-900' : 'text-gray-200'}`}
            >
              ★
            </button>
          ))}
        </div>
        {helpText}
        {errorMsg}
      </div>
    )
  }

  if (field.type === 'file') {
    return (
      <div>
        {label}
        <input
          type="file"
          onChange={e => onChange(e.target.files?.[0]?.name || '')}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-xs file:font-medium"
        />
        {helpText}
        {errorMsg}
      </div>
    )
  }

  // Default: text input types
  const inputType: Record<string, string> = {
    short_text: 'text',
    email: 'email',
    number: 'number',
    password: 'password',
    phone: 'tel',
    url: 'url',
    date: 'date',
    time: 'time',
    datetime: 'datetime-local',
  }

  return (
    <div>
      {label}
      <input
        type={inputType[field.type] || 'text'}
        value={(value as string) || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder || field.defaultValue || ''}
        required={field.required}
        minLength={field.validation?.minLength}
        maxLength={field.validation?.maxLength}
        min={field.validation?.min}
        max={field.validation?.max}
        className={`${baseInput} ${error ? 'border-red-300' : ''}`}
      />
      {helpText}
      {errorMsg}
    </div>
  )
}
