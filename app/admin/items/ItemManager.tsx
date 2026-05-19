'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2, Upload, X, Images, Star } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  createItem, updateItem, deleteItem,
  getItemImages, uploadItemImage, deleteItemImage,
  uploadMainImage, removeMainImage,
  type ItemFormData,
} from '@/app/admin/actions'
import { SITE_CONFIG } from '@/lib/config'
import type { Item } from '@/types/database'

type ImageEntry = { id: string; url: string; position: number }
type PendingFile = { file: File; previewUrl: string }

const PRICE_UNIT_LABELS: Record<string, string> = {
  zi: 'zi',
  noapte: 'noapte',
  ora: 'oră',
}

const EMPTY_FORM: ItemFormData = {
  name: '',
  description: '',
  price: 0,
  price_unit: 'zi',
  capacity: null,
  features: [],
  image_url: '',
  available: true,
}

interface ItemManagerProps {
  initialItems: Item[]
}

export function ItemManager({ initialItems }: ItemManagerProps) {
  const [items, setItems] = useState(initialItems)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [form, setForm] = useState<ItemFormData>(EMPTY_FORM)
  const [featuresInput, setFeaturesInput] = useState('')
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [itemImages, setItemImages] = useState<ImageEntry[]>([])
  const [uploadError, setUploadError] = useState('')
  const [isImagePending, startImageTransition] = useTransition()
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null)
  const [mainImageError, setMainImageError] = useState('')
  const [isMainPending, startMainTransition] = useTransition()
  const [pendingMain, setPendingMain] = useState<PendingFile | null>(null)
  const [pendingSecondary, setPendingSecondary] = useState<PendingFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mainInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { itemLabel } = SITE_CONFIG
  const itemSingular = itemLabel.singular.charAt(0).toUpperCase() + itemLabel.singular.slice(1)

  function clearPending() {
    if (pendingMain) URL.revokeObjectURL(pendingMain.previewUrl)
    pendingSecondary.forEach((p) => URL.revokeObjectURL(p.previewUrl))
    setPendingMain(null)
    setPendingSecondary([])
  }

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  function openAddDialog() {
    setEditingItem(null)
    setForm(EMPTY_FORM)
    setFeaturesInput('')
    setFormError('')
    setItemImages([])
    setMainImageUrl(null)
    setMainImageError('')
    setUploadError('')
    clearPending()
    setDialogOpen(true)
  }

  function openEditDialog(item: Item) {
    setEditingItem(item)
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: item.price,
      price_unit: item.price_unit,
      capacity: item.capacity,
      features: item.features ?? [],
      image_url: item.image_url ?? '',
      available: item.available,
    })
    setFeaturesInput((item.features ?? []).join(', '))
    setFormError('')
    setItemImages([])
    setUploadError('')
    setMainImageUrl(item.image_url ?? null)
    setMainImageError('')
    clearPending()
    setDialogOpen(true)
    startImageTransition(async () => {
      const imgs = await getItemImages(item.id)
      setItemImages(imgs)
    })
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setMainImageError('')

    if (!editingItem) {
      if (pendingMain) URL.revokeObjectURL(pendingMain.previewUrl)
      setPendingMain({ file, previewUrl: URL.createObjectURL(file) })
      return
    }

    startMainTransition(async () => {
      try {
        const fd = new FormData()
        fd.append('file', file)
        const result = await uploadMainImage(editingItem.id, fd)
        if (!result || 'error' in result) {
          setMainImageError((result as { error: string } | null)?.error ?? 'Eroare la upload.')
          return
        }
        setMainImageUrl(result.url)
        setForm((prev) => ({ ...prev, image_url: result.url }))
      } catch (err) {
        setMainImageError(err instanceof Error ? err.message : 'Eroare neașteptată la upload.')
      }
    })
  }

  function handleRemoveMainImage() {
    if (!editingItem) {
      if (pendingMain) URL.revokeObjectURL(pendingMain.previewUrl)
      setPendingMain(null)
      return
    }
    if (!confirm('Ștergi fotografia principală?')) return
    startMainTransition(async () => {
      await removeMainImage(editingItem.id)
      setMainImageUrl(null)
      setForm((prev) => ({ ...prev, image_url: '' }))
    })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''
    setUploadError('')

    if (!editingItem) {
      setPendingSecondary((prev) => [
        ...prev,
        ...files.map((f) => ({ file: f, previewUrl: URL.createObjectURL(f) })),
      ])
      return
    }

    startImageTransition(async () => {
      try {
        for (const file of files) {
          const fd = new FormData()
          fd.append('file', file)
          const result = await uploadItemImage(editingItem.id, fd)
          if (!result || 'error' in result) {
            setUploadError((result as { error: string } | null)?.error ?? 'Eroare la upload.')
            return
          }
          setItemImages((prev) => [...prev, result])
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Eroare neașteptată la upload.')
      }
    })
  }

  function handleDeleteImage(imageId: string) {
    startImageTransition(async () => {
      await deleteItemImage(imageId)
      setItemImages((prev) => prev.filter((img) => img.id !== imageId))
    })
  }

  function handleRemovePendingSecondary(index: number) {
    setPendingSecondary((prev) => {
      const item = prev[index]
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  function parseFeatures(input: string): string[] {
    return input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    if (!form.name.trim()) {
      setFormError(`Numele ${itemLabel.singular.endsWith('ă') ? 'camerei' : 'elementului'} este obligatoriu.`)
      return
    }
    if (form.price <= 0) {
      setFormError('Prețul trebuie să fie mai mare decât 0.')
      return
    }

    const finalForm = { ...form, features: parseFeatures(featuresInput) }

    startTransition(async () => {
      try {
        if (editingItem) {
          const result = await updateItem(editingItem.id, finalForm)
          if (result?.error) {
            setFormError(result.error)
            return
          }
        } else {
          const result = await createItem(finalForm)
          if (!result || 'error' in result) {
            setFormError((result as { error: string } | null)?.error ?? 'Eroare la creare.')
            return
          }
          const newId = result.id

          if (pendingMain) {
            const fd = new FormData()
            fd.append('file', pendingMain.file)
            const r = await uploadMainImage(newId, fd)
            if (!r || 'error' in r) {
              setFormError(`Elementul a fost creat, dar poza principală a eșuat: ${'error' in (r ?? {}) ? (r as { error: string }).error : 'eroare necunoscută'}`)
              clearPending()
              setDialogOpen(false)
              router.refresh()
              return
            }
          }

          for (const item of pendingSecondary) {
            const fd = new FormData()
            fd.append('file', item.file)
            const r = await uploadItemImage(newId, fd)
            if (!r || 'error' in r) {
              setFormError(`O poză suplimentară a eșuat: ${'error' in (r ?? {}) ? (r as { error: string }).error : 'eroare necunoscută'}`)
              clearPending()
              setDialogOpen(false)
              router.refresh()
              return
            }
          }

          clearPending()
        }

        setDialogOpen(false)
        router.refresh()
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setFormError(`Eroare neașteptată: ${msg}`)
      }
    })
  }

  function handleDelete(item: Item) {
    if (!confirm(`Ștergi "${item.name}"? Această acțiune este ireversibilă.`)) return
    startTransition(async () => {
      await deleteItem(item.id)
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {itemLabel.plural.charAt(0).toUpperCase() + itemLabel.plural.slice(1)}
        </h1>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Adaugă {itemLabel.singular}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-lg bg-white">
          <p>Nu există {itemLabel.plural} adăugate.</p>
          <Button onClick={openAddDialog} variant="outline" className="mt-4">
            Adaugă primul {itemLabel.singular}
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{itemSingular}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Preț</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Capacitate</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">{item.price} RON / {PRICE_UNIT_LABELS[item.price_unit] ?? item.price_unit}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.capacity ? `${item.capacity} pers.` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.available ? 'default' : 'secondary'}>
                      {item.available ? 'Disponibil' : 'Indisponibil'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(item)} className="gap-1">
                        <Pencil className="h-3.5 w-3.5" />
                        Editează
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item)} className="gap-1">
                        <Trash2 className="h-3.5 w-3.5" />
                        Șterge
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Editează ${itemLabel.singular}` : `Adaugă ${itemLabel.singular} nou`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nume *</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Numele elementului"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price">Preț (RON) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  value={form.price || ''}
                  onChange={(e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="100"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price_unit">Unitate preț</Label>
                <select
                  id="price_unit"
                  name="price_unit"
                  value={form.price_unit}
                  onChange={(e) => setForm((p) => ({ ...p, price_unit: e.target.value as ItemFormData['price_unit'] }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="zi">zi</option>
                  <option value="noapte">noapte</option>
                  <option value="ora">oră</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="capacity">Capacitate persoane</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={form.capacity ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, capacity: parseInt(e.target.value) || null }))}
                placeholder="ex: 4"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="features">Dotări / Caracteristici</Label>
              <Input
                id="features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="WiFi, Parcare, Aer condiționat (separate cu virgulă)"
              />
              <p className="text-xs text-muted-foreground">Separă cu virgulă</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Detalii suplimentare..."
                rows={2}
              />
            </div>

            {/* Main image */}
            <div className="space-y-3 pt-3 border-t">
              <Label className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                Fotografie principală
                <span className="text-xs font-normal text-muted-foreground">— apare pe card și pe pagina detaliu</span>
              </Label>

              <input
                ref={mainInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageChange}
              />

              {(() => {
                const displayUrl = editingItem ? mainImageUrl : pendingMain?.previewUrl ?? null
                if (!displayUrl) {
                  return (
                    <button
                      type="button"
                      onClick={() => mainInputRef.current?.click()}
                      disabled={isMainPending}
                      className="w-full aspect-[16/10] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-50"
                    >
                      {isMainPending ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6" />
                          <span className="text-sm font-medium">Încarcă poza principală</span>
                        </>
                      )}
                    </button>
                  )
                }
                return (
                  <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border group">
                    <Image
                      src={displayUrl}
                      alt="Fotografie principală"
                      fill
                      className="object-contain p-2"
                      sizes="500px"
                      unoptimized={!editingItem}
                    />
                    {isMainPending && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button type="button" size="sm" variant="secondary" onClick={() => mainInputRef.current?.click()} disabled={isMainPending} className="gap-1.5 text-xs shadow">
                        <Upload className="h-3.5 w-3.5" />
                        Înlocuiește
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={handleRemoveMainImage} disabled={isMainPending} className="shadow">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })()}

              {mainImageError && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{mainImageError}</p>
              )}
            </div>

            {/* Secondary images */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <Images className="h-4 w-4" />
                  Fotografii suplimentare
                </Label>
                <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImagePending} className="gap-1.5 text-xs">
                  {isImagePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {isImagePending ? 'Se încarcă...' : 'Încarcă poze'}
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
              </div>

              {itemImages.length === 0 && pendingSecondary.length === 0 && !isImagePending && (
                <p className="text-xs text-muted-foreground py-2 text-center border border-dashed rounded-lg">
                  Nicio fotografie suplimentară. Apasă "Încarcă poze" pentru a adăuga.
                </p>
              )}

              {(itemImages.length > 0 || pendingSecondary.length > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {itemImages.map((img) => (
                    <div key={img.id} className="relative group w-24 h-16 rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                      <Image src={img.url} alt="foto" fill className="object-cover" sizes="96px" />
                      <button type="button" onClick={() => handleDeleteImage(img.id)} disabled={isImagePending} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                  {pendingSecondary.map((item, i) => (
                    <div key={`pending-${i}`} className="relative group w-24 h-16 rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                      <Image src={item.previewUrl} alt="foto în așteptare" fill className="object-cover" sizes="96px" unoptimized />
                      <button type="button" onClick={() => handleRemovePendingSecondary(i)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{uploadError}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="available"
                name="available"
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="available">Disponibil pentru rezervări</Label>
            </div>

            {formError && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{formError}</p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isPending}>
                Anulează
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : editingItem ? 'Salvează' : 'Adaugă'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
