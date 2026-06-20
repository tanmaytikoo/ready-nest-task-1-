import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submitResponseSchema } from '@/lib/validations'
import { parseJson } from '@/lib/utils'

// Simple in-memory rate limit (per IP per form per 5 min)
const submissions = new Map<string, number>()

function getRateLimitKey(ip: string, formId: string) {
  return `${ip}:${formId}`
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const form = await db.form.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { fields: true },
  })

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  const rateLimitKey = getRateLimitKey(ip, form.id)
  const lastSubmission = submissions.get(rateLimitKey)
  const now = Date.now()

  if (lastSubmission && now - lastSubmission < 5 * 60 * 1000) {
    return NextResponse.json(
      { error: 'You have already submitted this form recently. Please wait a few minutes.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const parsed = submitResponseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid submission data' }, { status: 
            { status: 400 }
          )
        }
      }

      // Validate field-level rules
      const validation = parseJson<Record<string, unknown>>(field.validation, {})
      const value = fields[field.id]
      if (value && typeof value === 'string') {
        if (validation.minLength && value.length < (validation.minLength as number)) {
          return NextResponse.json(
            { error: `"${field.label}" must be at least ${validation.minLength} characters` },
            { status: 400 }
          )
        }
        if (validation.maxLength && value.length > (validation.maxLength as number)) {
          return NextResponse.json(
            { error: `"${field.label}" must be at most ${validation.maxLength} characters` },
            { status: 400 }
          )
        }
      }
    }

    // Create response
    const response = await db.response.create({ data: { formId: form.id } })

    const responseFieldData = []
    for (const field of form.fields) {
      if (field.type === 'divider' || field.type === 'heading') continue
      const value = fields[field.id]
      if (value !== undefined) {
        responseFieldData.push({
          responseId: response.id,
          fieldId: field.id,
          value: Array.isArray(value) ? JSON.stringify(value) : (value || null),
        })
      }
    }

    if (responseFieldData.length > 0) {
      await db.responseField.createMany({ data: responseFieldData })
    }

    submissions.set(rateLimitKey, now)

    return NextResponse.json({ success: true, responseId: response.id }, { status: 201 })
  } catch (error) {
    console.error('Submit response error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
