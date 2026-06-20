import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseJson } from '@/lib/utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const form = await db.form.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      fields: { orderBy: { order: 'asc' } },
    },
  })

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  // Increment view count
  await db.form.update({
    where: { id: form.id },
    data: { viewCount: { increment: 1 } },
  })

  return NextResponse.json({
    id: form.id,
    title: form.title,
    description: form.description,
    theme: parseJson(form.theme, {}),
    fields: form.fields.map((f: any) => ({
      id: f.id,
      type: f.type,
      label: f.label,
      placeholder: f.placeholder,
      helpText: f.helpText,
      required: f.required,
      defaultValue: f.defaultValue,
      options: parseJson(f.options, null),
      validation: parseJson(f.validation, null),
      order: f.order,
    })),
  })
}
