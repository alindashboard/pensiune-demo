'use server'

import { createSupabaseAdminClient } from '@/lib/supabase'
import { sendContactEmail } from '@/lib/email'

export interface ContactFormState {
  success?: boolean
  error?: string
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!name || !phone || !message) {
    return { error: 'Completează câmpurile obligatorii.' }
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from('contact_requests').insert({
    name,
    phone,
    email: email || null,
    message,
  })

  if (error) {
    return { error: 'Eroare la trimiterea mesajului. Încearcă din nou.' }
  }

  try {
    await sendContactEmail({ name, phone, email, message })
  } catch {
    // Email failure doesn't block the contact request
  }

  return { success: true }
}
