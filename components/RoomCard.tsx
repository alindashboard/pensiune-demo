import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'
import { S } from '@/lib/strings'
import { SITE_CONFIG } from '@/lib/config'
import type { Item } from '@/types/database'

const GRADIENTS = ['ph-room-1', 'ph-room-2', 'ph-room-3', 'ph-room-4', 'ph-room-5', 'ph-room-6']

interface RoomCardProps {
  room: Item | null
  gradientIndex?: number
}

export function RoomCard({ room, gradientIndex = 0 }: RoomCardProps) {
  const { branding } = SITE_CONFIG
  const gradient = GRADIENTS[gradientIndex % GRADIENTS.length]

  if (!room) {
    return (
      <div className="rounded-2xl border bg-card overflow-hidden animate-pulse">
        <div className={`h-48 ${gradient}`} />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <Link href={`/camere/${room.id}`} className="group block rounded-2xl border bg-card overflow-hidden card-hover">
      <div className={`relative h-48 ${gradient} flex items-end`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {room.available ? (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
            {S.rooms.available}
          </span>
        ) : (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-500 text-white">
            {S.rooms.unavailable}
          </span>
        )}
        <div className="relative z-10 p-4 w-full">
          <p className="text-white font-bold text-lg leading-tight drop-shadow">{room.name}</p>
        </div>
      </div>
      <div className="p-5">
        {room.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {room.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {room.capacity}{' '}
                {room.capacity === 1 ? S.rooms.person : S.rooms.persons}
              </span>
            </div>
            <div className="text-sm font-bold" style={{ color: branding.primaryColor }}>
              {room.price} RON
              <span className="text-xs font-normal text-muted-foreground ml-1">{S.rooms.perNight}</span>
            </div>
          </div>
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
            style={{ backgroundColor: branding.primaryColor + '15', color: branding.primaryColor }}
          >
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        {room.features && room.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {room.features.slice(0, 3).map((f) => (
              <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {f}
              </span>
            ))}
            {room.features.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{room.features.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
