import Link from 'next/link'
import Image from 'next/image'
import { Users, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SITE_CONFIG } from '@/lib/config'
import type { Item } from '@/types/database'

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const { itemLabel } = SITE_CONFIG

  const inner = (
    <Card
      className={`overflow-hidden flex flex-col h-full transition-all duration-200 ${
        item.available
          ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer group'
          : 'opacity-75'
      }`}
    >
      <div className={`relative aspect-[16/9] ${item.image_url ? '' : 'bg-slate-100'}`}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">Indisponibil</Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-lg mb-3">{item.name}</h3>

        {item.capacity && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Users className="h-4 w-4 shrink-0" />
            <span>{item.capacity} {item.capacity === 1 ? 'persoană' : 'persoane'}</span>
          </div>
        )}

        {item.features && item.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.features.slice(0, 3).map((f) => (
              <span key={f} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
            {item.features.length > 3 && (
              <span className="text-xs text-muted-foreground px-1">+{item.features.length - 3}</span>
            )}
          </div>
        )}

        {item.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2 pt-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{item.price} RON</span>
          <span className="text-muted-foreground text-sm">/ {itemLabel.priceUnit}</span>
        </div>
        {item.available && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
            Detalii
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </CardFooter>
    </Card>
  )

  if (!item.available) return inner

  return (
    <Link href={`/items/${item.id}`} className="block h-full">
      {inner}
    </Link>
  )
}
