'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [nameStatus, setNameStatus] = useState('')
  const [passwordStatus, setPasswordStatus] = useState('')
  const [nameError, setNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loadingName, setLoadingName] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        setUser(data)
        setName(data.name || '')
      })
  }, [])

  async function handleNameUpdate(e: React.FormEvent) {
    e.preventDefault()
    setNameError('')
    setNameStatus('')
    setLoadingName(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) { se
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            {passwordStatus && <p className="text-sm text-green-600">{passwordStatus}</p>}
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              id="current-password"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              id="new-password"
              helpText="Minimum 8 characters"
              required
            />
            <Button type="submit" size="sm" loading={loadingPassword}>Update Password</Button>
          </form>
        </div>

        {/* Account info */}
        <div className="rounded-lg border border-border p-5">
          <h2 className="mb-3 text-sm font-medium text-foreground">Account</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium text-foreground">
                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
