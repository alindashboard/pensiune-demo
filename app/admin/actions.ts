'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseAdminClient } from '@/lib/supabase'

// ── Reservation actions ──────────────────────────────────────────────────────

export async function approveReservation(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('reservations').update({ status: 'approved' }).eq('id', id)
  revalidatePath('/admin/dashboard')
}

export async function rejectReservation(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('reservations').update({ status: 'rejected' }).eq('id', id)
  revalidatePath('/admin/dashboard')
}

export async function cancelReservation(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id)
  revalidatePath('/admin/dashboard')
}

export async function deleteReservation(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('reservations').delete().eq('id', id)
  revalidatePath('/admin/dashboard')
}

// ── Item actions ─────────────────────────────────────────────────────────────

export interface ItemFormData {
  name: string
  description: string
  price: number
  price_unit: 'zi' | 'noapte' | 'ora'
  capacity: number | null
  features: string[]
  image_url: string
  available: boolean
}

export async function createItem(data: ItemFormData) {
  const supabase = createSupabaseAdminClient()
  const { data: created, error } = await supabase
    .from('items')
    .insert({
      name: data.name,
      description: data.description || null,
      price: data.price,
      price_unit: data.price_unit,
      capacity: data.capacity || null,
      features: data.features.length > 0 ? data.features : null,
      image_url: data.image_url || null,
      available: data.available,
    })
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidatePath('/admin/items')
  revalidatePath('/')
  return { id: created.id as string }
}

export async function updateItem(id: string, data: ItemFormData) {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('items')
    .update({
      name: data.name,
      description: data.description || null,
      price: data.price,
      price_unit: data.price_unit,
      capacity: data.capacity || null,
      features: data.features.length > 0 ? data.features : null,
      image_url: data.image_url || null,
      available: data.available,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/items')
  revalidatePath('/')
}

export async function deleteItem(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('items').delete().eq('id', id)
  revalidatePath('/admin/items')
  revalidatePath('/')
}

// ── Item image actions ───────────────────────────────────────────────────────

async function deleteFromStorage(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  imageUrl: string | null
) {
  if (!imageUrl) return
  try {
    const url = new URL(imageUrl)
    const pathInBucket = url.pathname.replace('/storage/v1/object/public/items/', '')
    if (!pathInBucket.startsWith('/')) {
      await supabase.storage.from('items').remove([pathInBucket])
    }
  } catch {
    // ignore — not a storage URL or already deleted
  }
}

export async function uploadMainImage(itemId: string, formData: FormData) {
  try {
    const supabase = createSupabaseAdminClient()
    const file = formData.get('file') as File
    if (!file || file.size === 0) return { error: 'Fișier invalid.' }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `items/${itemId}/main-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('items')
      .upload(path, file, { contentType: file.type || 'image/jpeg' })
    if (uploadError) return { error: uploadError.message }

    const { data: urlData } = supabase.storage.from('items').getPublicUrl(path)
    const publicUrl = urlData?.publicUrl
    if (!publicUrl) return { error: 'Nu s-a putut obține URL-ul public.' }

    const { data: oldItem } = await supabase
      .from('items')
      .select('image_url')
      .eq('id', itemId)
      .single()

    const { error: dbError } = await supabase
      .from('items')
      .update({ image_url: publicUrl })
      .eq('id', itemId)
    if (dbError) return { error: dbError.message }

    await deleteFromStorage(supabase, oldItem?.image_url ?? null)

    revalidatePath('/')
    revalidatePath('/admin/items')
    revalidatePath(`/items/${itemId}`)
    return { url: publicUrl }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

export async function removeMainImage(itemId: string) {
  const supabase = createSupabaseAdminClient()
  const { data: item } = await supabase
    .from('items')
    .select('image_url')
    .eq('id', itemId)
    .single()

  await supabase.from('items').update({ image_url: null }).eq('id', itemId)
  await deleteFromStorage(supabase, item?.image_url ?? null)

  revalidatePath('/')
  revalidatePath('/admin/items')
  revalidatePath(`/items/${itemId}`)
}

export async function getItemImages(itemId: string) {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('item_images')
    .select('id, url, position')
    .eq('item_id', itemId)
    .order('position', { ascending: true })
  return data ?? []
}

export async function uploadItemImage(itemId: string, formData: FormData) {
  try {
    const supabase = createSupabaseAdminClient()
    const file = formData.get('file') as File
    if (!file || file.size === 0) return { error: 'Fișier invalid.' }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `items/${itemId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('items')
      .upload(path, file, { contentType: file.type || 'image/jpeg' })
    if (uploadError) return { error: uploadError.message }

    const { data: urlData } = supabase.storage.from('items').getPublicUrl(path)
    const publicUrl = urlData?.publicUrl
    if (!publicUrl) return { error: 'Nu s-a putut obține URL-ul public.' }

    const { data: last } = await supabase
      .from('item_images')
      .select('position')
      .eq('item_id', itemId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle()
    const position = (last?.position ?? -1) + 1

    const { data, error: dbError } = await supabase
      .from('item_images')
      .insert({ item_id: itemId, url: publicUrl, position })
      .select()
      .single()
    if (dbError) return { error: dbError.message }

    revalidatePath('/')
    return data as { id: string; url: string; position: number }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

export async function deleteItemImage(imageId: string) {
  const supabase = createSupabaseAdminClient()

  const { data: img } = await supabase
    .from('item_images')
    .select('url')
    .eq('id', imageId)
    .single()

  await supabase.from('item_images').delete().eq('id', imageId)

  if (img?.url) {
    try {
      const url = new URL(img.url)
      const pathInBucket = url.pathname.replace('/storage/v1/object/public/items/', '')
      await supabase.storage.from('items').remove([pathInBucket])
    } catch {
      // ignore
    }
  }

  revalidatePath('/')
}

// ── Contact request actions ──────────────────────────────────────────────────

export async function markContactResolved(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('contact_requests').update({ resolved: true }).eq('id', id)
  revalidatePath('/admin/contact')
}

export async function deleteContactRequest(id: string) {
  const supabase = createSupabaseAdminClient()
  await supabase.from('contact_requests').delete().eq('id', id)
  revalidatePath('/admin/contact')
}
