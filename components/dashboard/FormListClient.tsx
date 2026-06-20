'use client'

import { useState } from 'react'
import { FormCard } from '@/components/dashboard/FormCard'
import { FormDef } from '@/types'

export function FormListClient({ forms: initialForms }: { forms: FormDef[] }) {
  const [forms, setForms] = useState(initialForms)

  function handleDelete(id: string) {
    setForms(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {forms.map(form => (
        <FormCard key={form.id} form={form} onDelete={handleDelete} />
      ))}
    </div>
  )
}
