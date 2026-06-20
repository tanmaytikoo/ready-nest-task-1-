'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export default function NewFormPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create form')
        return
      }

      router.push(`/forms/${data.id}/edit`)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Create Form</h1>
        <p className="text-sm text-muted-foreground">Give your form a name to get started</p>
      </div>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="form-title" className="text-sm font-medium text-foreground">Form Title</label>
            <Input
              type="text"
              placeholder="e.g. Contact Form, Job Application..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              id="form-title"
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="form-description" className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              placeholder="Optional — describe what this form is for"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              id="form-description"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" loading={loading}>
              Create & Edit Form
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
