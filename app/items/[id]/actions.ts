'use server'

import { redirect } from 'next/navigation'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { sendReservationEmails } from '@/lib/email'

interface ReservationData {
  itemId: string
  startDate: string
  endDate: string
  customerName: string
  customerPhone: string
  customerEmail: string
  guests: number | null
  notes: string
}

export async function submitReservation(
  data: ReservationData
): Promise<{ error: string } | undefined> {
  const { itemId, startDate, endDate, customerName, customerPhone, customerEmail, guests, notes } = data

  if (!customerName.trim() || !customerPhone.trim()) {
    return { error: 'Numele și telefonul sunt obligatorii.' }
  }

  const supabase = createSupabaseAdminClient()

  // Fetch item server-side — price must not come from client
  const { data: item } = await supabase
    .from('items')
    .select('price, name, capacity')
    .eq('id', itemId)
    .single()

  if (!item) {
    return { error: 'Elementul nu a fost găsit.' }
  }

  if (item.capacity && guests && guests > item.capacity) {
    return { error: `Numărul de persoane depășește capacitatea maximă (${item.capacity}).` }
  }

  // Check for overlapping approved/pending reservations
  const { data: conflicts } = await supabase
    .from('reservations')
    .select('id')
    .eq('item_id', itemId)
    .in('status', ['pending', 'approved'])
    .lte('start_date', endDate)
    .gte('end_date', startDate)

  if (conflicts && conflicts.length > 0) {
    return { error: 'Nu este disponibil în intervalul selectat. Te rugăm să alegi alte date.' }
  }

  const units = Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000
    )
  )
  const totalPrice = item.price * units

  const { error } = await supabase.from('reservations').insert({
    item_id: itemId,
    customer_name: customerName.trim(),
    customer_phone: customerPhone.trim(),
    customer_email: customerEmail.trim() || null,
    start_date: startDate,
    end_date: endDate,
    guests: guests || null,
    total_price: totalPrice,
    status: 'pending',
    notes: notes.trim() || null,
  })

  if (error) {
    return { error: 'Eroare la salvarea rezervării. Încearcă din nou sau contactează-ne direct.' }
  }

  try {
    await sendReservationEmails({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      itemName: item.name,
      startDate,
      endDate,
      guests: guests || null,
      totalPrice,
      notes: notes.trim(),
    })
  } catch {
    // Email failure doesn't block the reservation
  }

  redirect('/rezervare-confirmata')
}
