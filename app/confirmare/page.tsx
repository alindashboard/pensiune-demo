import Link from 'next/link'
import { CheckCircle2, Phone } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/config'
import { S } from '@/lib/strings'

export default function ConfirmarePage() {
  const { business, branding } = SITE_CONFIG

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: branding.primaryColor + '20' }}
            >
              <CheckCircle2 className="h-10 w-10" style={{ color: branding.primaryColor }} />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3">{S.confirmation.title}</h1>
          <p className="text-muted-foreground mb-2">{S.confirmation.subtitle}</p>
          <p className="text-muted-foreground mb-2">{S.confirmation.body}</p>
          <p className="text-muted-foreground mb-8 text-sm">{S.confirmation.callNote}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:${business.phone}`}>
              <Button
                variant="default"
                className="gap-2 w-full sm:w-auto"
                style={{ backgroundColor: branding.primaryColor, color: '#fff' }}
              >
                <Phone className="h-4 w-4" />
                {business.phoneDisplay}
              </Button>
            </a>
            <Link href="/camere">
              <Button variant="outline" className="w-full sm:w-auto">
                {S.confirmation.backToRooms}
              </Button>
            </Link>
          </div>
          <div className="mt-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {S.confirmation.backHome}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
