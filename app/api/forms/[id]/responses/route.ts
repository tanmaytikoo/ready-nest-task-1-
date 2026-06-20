import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const form = await db.form.findFirst({ where: { id, userId: session.userId } })
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const [responses, total] = await Promise.all([
    db.response.findMany({
      where: { formId: id },
      orderBy: { submittedAt: 'desc' },
      skip,
      take: limit,
      include: {
        fields: {
          include: {
            field: {
              select: { label: true, type: true },
            },
          },
        },
      },
    }),
    db.response.count({ where: { formId: id } }),
  ])

  return NextResponse.json({
    responses,
    total,
    page,
    pages: Math.ceil(total / limit),
  })
}
