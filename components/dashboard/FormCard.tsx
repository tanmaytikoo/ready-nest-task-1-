import Link from 'next/link'
import { Form } from '@prisma/client'
import { Edit, BarChart2, Eye, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function FormCard({ form }: { form: Form & { _count: { responses: number } } }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-background p-5 shadow-neumorph transition-all hover:-translate-y-1 hover:shadow-neumorph-sm">
      <div>
        <div className="flex items-start justify-between">
          <Link href={`/forms/${form.id}/edit`} className="group">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {form.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {form.description || 'No description provided.'}
            </p>
          </Link>
          <button className="rounded-xl p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:shadow-neumorph-inner">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary shadow-neumorph-inner">
            <BarChart2 className="h-4 w-4" />
            <span>{form._count.responses}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary shadow-neumorph-inner">
            <div className={`h-2 w-2 rounded-full ${form.status === 'PUBLISHED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : form.status === 'DRAFT' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-gray-400'}`} />
            <span className="capitalize">{form.status.toLowerCase()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/forms/${form.slug}`} target="_blank">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/forms/${form.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
