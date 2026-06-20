import type { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { FormCard } from '@/components/dashboard/FormCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { parseJson } from '@/lib/utils'
import { FileText, Plus } from 'lucide-react'
import { FormDef } from '@/types'
import { FormListClient } from '@/components/dashboard/FormListClient'

export const metadata: Metadata = { title: 'Forms' }

export default async function FormsPage() {
  const session = await getSession()
  if (!session) return null

  const forms = await db.form.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { responses: true } } },
  })

  const formDefs: FormDef[] = forms.map((f: any) => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    theme: parseJson(f.theme, {}),
    status: f.status as FormDef['status'],
  }))

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Forms</h1>
          <p className="text-sm text-muted-foreground">
            {forms.length} {forms.length === 1 ? 'form' : 'forms'} total
          </p>
        </div>
        <Link href="/forms/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Form
          </Button>
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
                Create your first form
              </Button>
            </Link>
          }
        />
      ) : (
        <FormListClient forms={formDefs} />
      )}
    </div>
  )
}
