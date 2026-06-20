'use client'

import { useState } from 'react'
import { FormFieldDef, ResponseDef } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Inbox, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface ResponsesClientProps {
  formId: string
  fields: FormFieldDef[]
  initialResponses: ResponseDef[]
  total: number
}

export function ResponsesClient({ formId, fields, initialResponses, total }: ResponsesClientProps) {
  const [responses, setResponses] = useState(initialResponses)
  const [selected, setSelected] = useState<ResponseDef | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(total / 20))
  const [totalCount] = useState(total)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadPage(p: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/forms/${formId}/responses?page=${p}&limit=20`)
      const data = await res.json()
      setResponses(data.responses)
      setTotalPages(data.pages)
      setPage(p)
    } finally {
      setLoading(false)
    }
  }

  const displayFields = fields
    .filter(f => f.type !== 'divider' && f.type !== 'heading')
    .slice(0, 4)

  const f
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadPage(page + 1)}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Response Details"
        size="md"
      >
        {selected && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Submitted {formatDateTime(selected.submittedAt)}
            </p>
            {fields
              .filter(f => f.type !== 'divider' && f.type !== 'heading')
              .map(field => {
                const rf = selected.fields.find(f => f.fieldId === field.id)
                let value = rf?.value || ''
                try {
                  if (value.startsWith('[')) value = JSON.parse(value).join(', ')
                } catch {}
                return (
                  <div key={field.id} className="rounded-md border border-border p-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">{field.label}</p>
                    <p className="text-sm text-foreground">
                      {value || <span className="italic text-muted-foreground">No answer</span>}
                    </p>
                  </div>
                )
              })}
          </div>
        )}
      </Modal>
    </div>
  )
}
