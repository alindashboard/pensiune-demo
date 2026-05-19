import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16 text-center">
      <div>
        <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Pagina nu a fost găsită</h2>
        <p className="text-muted-foreground mb-8">
          Pagina pe care o cauți nu există sau a fost mutată.
        </p>
        <Link href="/">
          <Button>Înapoi acasă</Button>
        </Link>
      </div>
    </main>
  )
}
