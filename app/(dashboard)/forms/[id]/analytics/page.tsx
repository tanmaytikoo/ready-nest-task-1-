import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params

  const form = await db.form.findFirst({
    where: { id, userId: session.userId },
    select: { title: true, viewCount: true },
  })
  if (!form) notFound()

  const totalSubmissions = await db.response.count({ where: { formId: id } })

  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const recentResponses = await db.response.findMany({
    where: { formId: id, submittedAt: { gte: fourteenDaysAgo } },
    select: { submittedAt: true },
    orderBy: { submittedAt: 'asc' },
  })

  const trendMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    trendMap[d.toISOString().slice(0, 10)] = 0
  }
  recentResponses.forEach((r: { submittedAt: Date }) => {
    const key = r.submittedAt.toISOString().slice(0, 10)
    if (key in trendMap) trendMap[key]++
  })
  const trend = Object.entries(trendMap).map(([date, count]) => ({ date, count }))
  const conversionRate =
  const step = width / (trend.length - 1)

  const points = trend
    .map((t, i) => {
      const x = i * step
      const y = height - (t.count / max) * height
      return `${x},${y}`
    })
    .join(' ')

  const area =
    `0,${height} ` +
    trend
      .map((t, i) => {
        const x = i * step
        const y = height - (t.count / max) * height
        return `${x},${y}`
      })
      .join(' ') +
    ` ${width},${height}`

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-20 w-full"
      >
        <defs>
          <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#trend-gradient)" className="text-foreground" />
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        />
      </svg>
      <div className="mt-2 flex justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(trend[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(trend[trend.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}
