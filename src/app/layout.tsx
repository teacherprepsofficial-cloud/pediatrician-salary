import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Pediatrician Salary Database | Real Salaries from Real Pediatricians',
  description: 'Browse real pediatrician salary data submitted anonymously by pediatricians across the US. Compare salaries by specialty, state, and practice setting.',
  openGraph: {
    title: 'Pediatrician Salary Database',
    description: 'Real salary data submitted anonymously by pediatricians across the US.',
    type: 'website',
    url: 'https://pediatriciansalary.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
