import type { MetadataRoute } from 'next'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let items: { id: string; created_at: string }[] = []
  try {
    const supabase = createSupabaseAdminClient()
    const { data } = await supabase
      .from('items')
      .select('id, created_at')
      .eq('available', true)
    items = data ?? []
  } catch {
    // No env vars at build time — return static pages only
  }

  const itemPages: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${SITE_CONFIG.url}/camere/${item.id}`,
    lastModified: new Date(item.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/camere`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/despre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.url}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...itemPages,
  ]
}
