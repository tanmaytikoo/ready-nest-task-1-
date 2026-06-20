import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { FormBuilder } from '@/components/builder/FormBuilder'
import { parseJson } from '@/lib/utils'
import { FormFieldDef, FormTheme } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const form = await db.form.findUnique({ where: { id }, select: { title: true } })
  return { title: form ? `Edit: ${form.title}` : 'Form Builder' }
}

export default async function FormEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params

  const form = await db.form.findFirst({
    where: { id, userId: session.userId },
    include: { fields: { orderBy: { order: 'asc' } } },
  })

  if (!form) notFound()

  const fields: FormFieldDef[] = form.fields.map((f: any) => ({
    id: f.id,
    formId: f.formId,
    type: f.type as FormFieldDef['type'],
    label: f.label,
    placeholder: f.placeholder,
    helpText: f.helpText,
    required: f.required,
    defaultValue: f.defaultValue,
    options: parseJson(f.options, null),
    validation: parseJson(f.validation, null),
    order: f.order,
  }))

  const theme: FormTheme = parseJson(form.theme, {})

  return (
    <FormBuilder
      formId={form.id}
      initialTitle={form.title}
      initialFields={fields}
      initialStatus={form.status}
      initialTheme={theme}
      formSlug={form.slug}
    />
  )
}
