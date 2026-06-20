import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = { title: 'Sign In' }

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-foreground">FLUX</span>
          <p className="mt-1 text-sm text-muted-foreground">Dynamic Form Builder</p>
        </div>
        {children}
      </div>
    </div>
  )
}
