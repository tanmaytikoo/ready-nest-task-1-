import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const form = await db.form.findFirst({ where: { id, userId: session.userId } })
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  const newStatus = form.status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED'
  const updated = await db.form.update({ where: { id }, data: { status: newStatus } })
  return NextResponse.json({ status: updated.status })
}
