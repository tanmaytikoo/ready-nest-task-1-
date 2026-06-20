import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { createFormSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { parseJson } from '@/lib/utils'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const forms = await db.form.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { responses: true } },
    },
  })

  return NextResponse.json(
    forms.map((f: any) => ({
      ...f,
      theme: parseJson(f.theme, {}),
    }))
  )
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = createFormSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { title, description } = parsed.data
    const slug = generateSlug(title)

    const form = await db.form.create({
      data: {
        userId: session.userId,
        title,
        description: description || null,
        slug,
        theme: '{}',
      },
    })

    return NextResponse.json({ ...form, theme: {} }, { status: 201 })
  } catch (error) {
    console.error('Create form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
