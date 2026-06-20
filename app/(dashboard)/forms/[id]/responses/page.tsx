import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ResponsesClient } from '@/components/responses/ResponsesClient'
import { parseJson } from '@/lib/utils'
import { FormFieldDef } from '@/types'

export const metadata: Metadata = { title: 'Responses' }

export default async function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params

  const form = await db.form.findFirst({
    where: { id, userId: session.userId },
    include: { fields: { orderBy: { order: 'asc' } } },
  })

  if (!form) notFound()

  const [responses, total] = await Promise.all([
    db.response.findMany({
      where: { formId: id },
      orderBy: { submittedAt: 'desc' },
      take: 20,
      include: {
        fields: {
          include: { field: { select: { label: true, type: true } } },
        },
      },
    }),
    db.response.count({ where: { formId: id } }),
  ])

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

  const serializedResponses = responses.map((r: any) => ({
    id: r.id,
    formId: r.formId,
    submittedAt: r.submittedAt.toISOString(),
    fields: r.fields.map((f: any) => ({
      id: f.id,
      fieldId: f.fieldId,
      value: f.value,
      field: f.field,
    })),
  }))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Responses</h1>
        <p className="text-sm text-muted-foreground">
          {form.title} · {total} {total === 1 ? 'response' : 'responses'}
        </p>
      </div>
      <ResponsesClient
        formId={id}
        fields={fields}
        initialResponses={serializedResponses}
        total={total}
      />
    </div>
  )
}
