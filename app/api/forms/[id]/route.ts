import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { updateFormSchema } from '@/lib/validations'
import { parseJson } from '@/lib/utils'

async function getFormOrFail(id: string, userId: string) {
  const form = await db.form.findFirst({
    where: { id, userId },
  })
  return form
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const form = await db.form.findFirst({
    where: { id, userId: session.userId },
    include: {
      fields: { orderBy: { order: 'asc' } },
      _count: { select: { responses: true } },
    },
  })

  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  return NextResponse.json({
    ...form,
    theme: parseJson(form.theme, {}),
    fields: form.fields.map((f: any) => ({
      ...f,
      options: parseJson(f.options, null),
      validation: parseJson(f.validation, null),
    })),
  })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const form = await getFormOr
          data: fields.map((f, i) => ({
            formId: id,
            type: f.type,
            label: f.label,
            placeholder: f.placeholder || null,
            helpText: f.helpText || null,
            required: f.required ?? false,
            defaultValue: f.defaultValue || null,
            options: f.options ? JSON.stringify(f.options) : null,
            validation: f.validation ? JSON.stringify(f.validation) : null,
            order: f.order ?? i,
          })),
        })
      }
    }

    const result = await db.form.findFirst({
      where: { id },
      include: {
        fields: { orderBy: { order: 'asc' } },
        _count: { select: { responses: true } },
      },
    })

    if (!result) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

    return NextResponse.json({
      ...result,
      theme: parseJson(result.theme, {}),
      fields: result.fields.map((f: any) => ({
        ...f,
        options: parseJson(f.options, null),
        validation: parseJson(f.validation, null),
      })),
    })
  } catch (error) {
    console.error('Update form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const form = await getFormOrFail(id, session.userId)
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  await db.form.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
