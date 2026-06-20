'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/forms', label: 'Forms', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className={cn(
      "flex h-full w-16 flex-col items-center py-4 rounded-2xl border transition-colors",
      "bg-gray-200 dark:bg-white/5 shadow-neumorph-inner border-white/10 dark:border-black/5"
    )}>
      {/* Logo */}
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-neumorph-sm">
        <svg viewBox="0 0 100 100" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
          <clipPath id="phi-logo-clip">
            <rect x="0" y="0" width="35" height="100" />
            <rect x="65" y="0" width="35" height="100" />
          </clipPath>
          <circle cx="50" cy="50" r="34" fill="none" 
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-neumorph'
                  : 'text-muted-foreground hover:bg-background/50 hover:text-foreground hover:shadow-neumorph-inner'
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="flex flex-col items-center gap-4">
        <div
          title={userName}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background/50 text-foreground shadow-neumorph-inner"
        >
          <span className="text-sm font-medium">
            {userName.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="text-foreground">
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive hover:shadow-neumorph-inner"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  )
}
