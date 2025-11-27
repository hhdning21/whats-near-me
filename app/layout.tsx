import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins' 
});

export const metadata: Metadata = {
  title: "What's Near Me - UBC Student App",
  description: 'Discover restaurants, study spots, and resources near you. Built for UBC students to enhance campus life and wellbeing.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${geist.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
