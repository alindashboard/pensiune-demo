export interface Item {
  id: string
  name: string
  description: string | null
  price: number
  price_unit: 'zi' | 'noapte' | 'ora'
  capacity: number | null
  features: string[] | null
  image_url: string | null
  available: boolean
  created_at: string
}

export interface ItemImage {
  id: string
  item_id: string
  url: string
  position: number
  created_at: string
}

export interface Reservation {
  id: string
  item_id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  start_date: string
  end_date: string
  guests: number | null
  total_price: number | null
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  notes: string | null
  created_at: string
  items?: Item
}

export interface ContactRequest {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  resolved: boolean
  created_at: string
}

export interface SiteSetting {
  key: string
  value: unknown
  updated_at: string
}
