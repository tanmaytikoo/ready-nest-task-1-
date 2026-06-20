'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FormTheme } from '@/types'
import { Copy, Check, ExternalLink } from 'lucide-react'
import dynamic from 'next/dynamic'

const QRCode = dynamic(() => import('qrcode.react').then(m => m.QRCodeSVG), { ssr: false })

interface SettingsClientProps {
  formId: string
  slug: string
  status: string
  initialTheme: FormTheme
  shareUrl: string
}

const THEME_MODES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'monochrome', label: 'Monochrome' },
]

const FONT_PAIRINGS = [
  { value: 'system', label: 'System Default' },
  { value: 'geist', label: 'Geist' },
  { value: 'inter', label: 'Inter' },
  { value: 'mono', label: 'Monospace' },
]

export function SettingsClient({ formId, slug, status, initialTheme, shareUrl }: SettingsClientProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<FormTheme>(initialTheme)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  function updateTheme(patch: Partial<FormTheme>) {
    setTheme(t => ({ ...t, ...patch }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/f
                  key={f.value}
                  onClick={() => updateTheme({ fontPairing: f.value })}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    theme.fontPairing === f.value
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="rounded-lg border border-border p-5">
        <h2 className="mb-4 text-sm font-medium text-foreground">Branding</h2>
        <div className="space-y-4">
          <Input
            label="Brand Name"
            value={theme.brandName || ''}
            onChange={e => updateTheme({ brandName: e.target.value })}
            placeholder="Your company or product name"
            id="brand-name"
          />
          <Input
            label="Header Text"
            value={theme.headerText || ''}
            onChange={e => updateTheme({ headerText: e.target.value })}
            placeholder="Shown above the form"
            id="header-text"
          />
          <Input
            label="Footer Text"
            value={theme.footerText || ''}
            onChange={e => updateTheme({ footerText: e.target.value })}
            placeholder="e.g. Powered by FLUX"
            id="footer-text"
          />
        </div>
      </div>

      <Button onClick={handleSave} loading={saving} disabled={saved}>
        {saved ? 'Saved!' : 'Save Settings'}
      </Button>
    </div>
  )
}
