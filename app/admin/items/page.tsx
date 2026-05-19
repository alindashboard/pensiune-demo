export const dynamic = 'force-dynamic'

import { AdminShell } from '@/components/admin/AdminShell'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { ItemManager } from './ItemManager'

export default async function ItemsPage() {
  const supabase = createSupabaseAdminClient()
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <AdminShell activeSection="items">
      <div className="p-6">
        <ItemManager initialItems={items ?? []} />
      </div>
    </AdminShell>
  )
}
