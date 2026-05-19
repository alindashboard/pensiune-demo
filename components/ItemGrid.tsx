'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { ItemCard } from '@/components/ItemCard'
import { SITE_CONFIG } from '@/lib/config'
import type { Item } from '@/types/database'

interface ItemGridProps {
  items: Item[]
  title?: string
  subtitle?: string
}

export function ItemGrid({ items, title, subtitle }: ItemGridProps) {
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null)

  const { itemLabel } = SITE_CONFIG

  const maxPossible = Math.max(...items.map((i) => i.price), 0)
  const capacities = Array.from(new Set(items.map((i) => i.capacity).filter(Boolean))).sort(
    (a, b) => (a ?? 0) - (b ?? 0)
  ) as number[]

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (minPrice !== null && item.price < minPrice) return false
        if (maxPrice !== null && item.price > maxPrice) return false
        if (capacityFilter !== null && item.capacity !== capacityFilter) return false
        return true
      }),
    [items, minPrice, maxPrice, capacityFilter]
  )

  const hasFilters = minPrice !== null || maxPrice !== null || capacityFilter !== null

  function resetFilters() {
    setMinPrice(null)
    setMaxPrice(null)
    setCapacityFilter(null)
  }

  return (
    <>
      <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
        <div className="min-w-0">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex gap-2 shrink-0 flex-wrap">
          {capacities.length > 0 && (
            <SimpleDropdown
              label="Capacitate"
              options={capacities.map((c) => ({ value: c, label: `${c} ${c === 1 ? 'persoană' : 'persoane'}` }))}
              value={capacityFilter}
              onChange={setCapacityFilter}
            />
          )}
        </div>
      </div>

      {hasFilters && (
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length === 0
            ? `Nicio ${itemLabel.singular} nu corespunde filtrelor.`
            : `${filtered.length} ${filtered.length === 1 ? itemLabel.singular + ' găsit' : itemLabel.plural + ' găsite'}`}
          {' · '}
          <button onClick={resetFilters} className="text-primary font-semibold hover:underline">
            Resetează
          </button>
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl">
          <p className="text-lg text-muted-foreground mb-2">
            Nu există {itemLabel.plural} disponibile cu aceste criterii.
          </p>
          <button onClick={resetFilters} className="text-primary font-semibold hover:underline">
            Resetează filtrele
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  )
}

interface SimpleDropdownProps<T> {
  label: string
  options: { value: T; label: string }[]
  value: T | null
  onChange: (v: T | null) => void
}

function SimpleDropdown<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: SimpleDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const displayText = value !== null
    ? options.find((o) => o.value === value)?.label ?? 'Toate'
    : 'Toate'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
          value !== null
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
        }`}
      >
        <span>{label}: <span className="font-medium opacity-90">{displayText}</span></span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[180px] bg-white border rounded-lg shadow-lg z-20 overflow-hidden">
          <button
            type="button"
            onClick={() => { onChange(null); setOpen(false) }}
            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b ${
              value === null ? 'font-semibold text-primary' : 'text-slate-700'
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              {value === null && <Check className="h-4 w-4" />}
            </span>
            Toate
          </button>
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                value === opt.value ? 'font-semibold text-primary' : 'text-slate-700'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {value === opt.value && <Check className="h-4 w-4" />}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
