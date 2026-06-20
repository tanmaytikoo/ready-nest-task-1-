import type { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { FormCard } from '@/components/dashboard/FormCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { parseJson } from '@/lib/utils'
import { FileText, Plus } from 'lucide-react'
import { FormDef } from '@/types'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const [forms, totalResponses] = await Promise.all([
    db.form.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: 'desc' },
      take: 6,
      include: { _count: { select: { responses: true } } },
    }),
    db.response.count({
      where: { form: { userId: session.userId } },
    }),
  ])

  const totalForms = forms.length
  const activeForms = forms.filter((f: { status: string }) => f.status === 'PUBLISHED').length

  const formDefs: FormDef[] = forms.map((f: any) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    theme: parseJson(f.theme, {}),
    status: f.status as FormDef['status'],
  }))

  return (
    <div className="p-6">
      <div className="mb-6 flex 
        </div>
        <Link href="/forms/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Form
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Total Forms" value={totalForms} />
        <StatsCard label="Published Forms" value={activeForms} />
        <StatsCard label="Total Responses" value={totalResponses} />
      </div>

      {/* Recent forms */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Recent Forms</h2>
          <Link href="/forms" className="text-xs text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>

        {formDefs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No forms yet"
            description="Create your first form to start collecting responses."
            action={
              <Link href="/forms/new">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Create a form
                </Button>
              </Link>
            }
          />
        ) : (
          <DashboardFormList forms={formDefs} />
        )}
      </div>
    </div>
  )
}

function DashboardFormList({ forms }: { forms: FormDef[] }) {
  // Client components handle delete, so we use a wrapper
  return <FormListClient forms={forms} />
}

// Inline client wrapper to handle optimistic delete
import { FormListClient } from '@/components/dashboard/FormListClient'
