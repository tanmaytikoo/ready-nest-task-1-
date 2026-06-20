import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-background p-3 gap-3">
      <Sidebar userName={session.name} />
      <main className="flex-1 overflow-y-auto rounded-xl bg-secondary/50 shadow-neumorph-inner p-5">
        {children}
      </main>
    </div>
  )
}
