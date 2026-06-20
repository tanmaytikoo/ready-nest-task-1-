import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { PublicForm } from '@/components/forms/PublicForm'
import { parseJson } from '@/lib/utils'
import { FormFieldDef, FormTheme } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const form = await db.form.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: { title: true, description: true },
  })
  if (!form) return { title: 'Form Not Found' }
  return {
    title: form.title,
    description: form.description || undefined,
  }
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const form = await db.form.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { fields: { orderBy: { order: 'asc' } } },
  })

  if (!form) notFound()

  // Increment view count (fire and forget)
  db.form.update({ where: { id: form.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  const fields: FormFieldDef[] = form.fields.map(f => ({
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
    <PublicForm
      formId={form.id}
      slug={form.slug}
      title={form.title}
      description={form.description}
      fields={fields}
      theme={theme}
    />
  )
}
