import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { updateProfileSchema } from '@/lib/validations'

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = updateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, currentPassword, newPassword } = parsed.data
    const updates: Record<string, string> = {}

    if (name) updates.name = name

    if (currentPassword && newPassword) {
      const user = await db.user.findUnique({ where: { id: session.userId } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      const valid = await verifyPassword(currentPassword, user.password)
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      updates.password = await hashPassword(newPassword)
    }

    const user = await db.user.update({
      where: { id: session.userId },
      data: updates,
      select: { id: true, name: true, email: true, createdAt: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
