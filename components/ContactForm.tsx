'use client'

import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SITE_CONFIG } from '@/lib/config'

const initialState: ContactFormState = {}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, initialState)

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Mesaj trimis!</h3>
        <p className="text-green-700">
          Te vom contacta în cel mai scurt timp. Poți suna direct la{' '}
          <a href={`tel:${SITE_CONFIG.business.phone}`} className="font-semibold underline">
            {SITE_CONFIG.business.phoneDisplay}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Nume <span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" placeholder="Numele tău" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Telefon <span className="text-red-500">*</span>
          </Label>
          <Input id="phone" name="phone" type="tel" placeholder="+40 7xx xxx xxx" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email (opțional)</Label>
        <Input id="email" name="email" type="email" placeholder="adresa@email.com" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">
          Mesaj <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Cum te putem ajuta?"
          rows={4}
          required
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full"
        style={{ backgroundColor: SITE_CONFIG.branding.primaryColor, color: '#fff' }}
      >
        {pending ? 'Se trimite...' : 'Trimite mesajul'}
      </Button>
    </form>
  )
}
