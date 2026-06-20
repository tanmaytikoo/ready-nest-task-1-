import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const form = await db.form.findFirst({
    where: { id, userId: session.userId },
    include: { fields: { orderBy: { order: 'asc' } } },
  })
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  const newForm = await db.form.create({
    data: {
      userId: session.userId,
      title: `${form.title} (Copy)`,
      description: form.description,
      slug: generateSlug(`${form.title} copy`),
      status: 'DRAFT',
      theme: form.theme,
    },
  })

  if (form.fields.length > 0) {
    await db.formField.createMany({
      data: form.fields.map((f: any) => ({
        formId: newForm.id,
        type: f.type,
        label: f.label,
        placeholder: f.placeholder,
        helpText: f.helpText,
        required: f.required,
        defaultValue: f.defaultValue,
        options: f.options,
        validation: f.validation,
        order: f.order,
      })),
    })
  }

  return NextResponse.json({ id: newForm.id, slug: newForm.slug }, { status: 201 })
}
