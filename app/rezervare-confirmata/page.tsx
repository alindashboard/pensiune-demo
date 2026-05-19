import Link from 'next/link'
import { CheckCircle2, Phone } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/config'

export default function ConfirmationPage() {
  const { business, itemLabel } = SITE_CONFIG

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3">Cererea a fost trimisă!</h1>
          <p className="text-muted-foreground mb-2">
            Rezervarea ta este în așteptarea confirmării. Te vom contacta telefonic în cel mai
            scurt timp pentru a confirma detaliile.
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            Dacă nu ești contactat în 2 ore, sună-ne direct:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:${business.phone}`}>
              <Button variant="default" className="gap-2">
                <Phone className="h-4 w-4" />
                {business.phoneDisplay}
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline">
                Înapoi la {itemLabel.plural}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
