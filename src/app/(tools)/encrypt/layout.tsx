import type { Metadata } from 'next'
import SeoSchema from '@/components/SeoSchema'

export const metadata: Metadata = {
  title: 'Client-Side Data Encrypt & Decrypt Tool (AES-GCM-256, Base64, ROT13) — FenaQuery',
  description:
    'Securely encrypt and decrypt text client-side. Supports AES-GCM-256, AES-CBC, Base64 encoding/decoding, and ROT13 cipher powered directly by your browser\'s Web Crypto API.',
  keywords: [
    'AES-GCM encryption online',
    'online encrypt decrypt',
    'Base64 encoder decoder',
    'ROT13 cipher generator',
    'Web Crypto API tool',
    'secure browser encryption',
  ],
  alternates: {
    canonical: '/encrypt',
  },
  openGraph: {
    title: 'Client-Side Data Encrypt & Decrypt Tool — FenaQuery',
    description: 'Securely encrypt and decrypt text. Supports AES-GCM-256, AES-CBC, Base64, and ROT13 powered by the Web Crypto API.',
    url: 'https://fenaquery.fenaxra.com/encrypt',
  },
}

export default function EncryptLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SeoSchema
        name="Client-Side Data Encrypt & Decrypt Tool"
        description="Securely encrypt and decrypt text client-side using industry-standard cryptography standards (AES-GCM-256, AES-CBC, Base64, ROT13) powered by the Web Crypto API."
        url="https://fenaquery.fenaxra.com/encrypt"
      />
      {children}
    </>
  )
}
