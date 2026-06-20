import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { parseJson, getPublicFormUrl } from '@/lib/utils'
import { FormTheme } from '@/types'
import { SettingsClient } from '@/components/forms/SettingsClient'

export const metadata: Metadata = { title: 'Form Settings' }

export default async function FormSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params

  const form = await db.form.findFirst({
    where: { id, userId: session.userId },
    select: { id: true, title: true, slug: true, theme: true, status: true },
  })
  if (!form) notFound()

  const theme: FormTheme = parseJson(form.theme, {})
  const shareUrl = getPublicFormUrl(form.slug)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Form Settings</h1>
        <p className="text-sm text-muted-foreground">{form.title}</p>
      </div>
      <SettingsClient
        formId={form.id}
        slug={form.slug}
        status={form.status}
        initialTheme={theme}
        shareUrl={shareUrl}
      />
    </div>
  )
}
