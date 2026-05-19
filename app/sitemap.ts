import type { MetadataRoute } from 'next'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseAdminClient()
  const { data: items } = await supabase
    .from('items')
    .select('id, created_at')
    .eq('available', true)

  const itemPages: MetadataRoute.Sitemap = (items ?? []).map((item) => ({
    url: `${SITE_CONFIG.url}/items/${item.id}`,
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
    ...itemPages,
  ]
}
