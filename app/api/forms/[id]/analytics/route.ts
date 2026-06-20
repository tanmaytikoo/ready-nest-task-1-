import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const form = await db.form.findFirst({
    where: { id, userId: session.userId },
    select: { viewCount: true },
  })
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  const totalSubmissions = await db.response.count({ where: { formId: id } })

  // Get last 14 days of responses
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const recentResponses = await db.response.findMany({
    where: { formId: id, submittedAt: { gte: fourteenDaysAgo } },
    select: { submittedAt: true },
    orderBy: { submittedAt: 'asc' },
  })

  // Group by date
  const trendMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    trendMap[key] = 0
  }
  recentResponses.forEach((r: { submittedAt: Date }) => {
    const key = r.submittedAt.toISOString().slice(0, 10)
    if (key in trendMap) trendMap[key]++
  })

  const trend = Object.entries(trendMap).map(([date, count]) => ({ date, count }))
  const conversionRate = form.viewCount > 0 ? (totalSubmissions / form.viewCount) * 100 : 0

  return NextResponse.json({
    totalViews: form.viewCount,
    totalSubmissions,
    conversionRate: Math.round(conversionRate * 10) / 10,
    trend,
  })
}
