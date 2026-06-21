import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'کشت‌یار - دستیار هوشمند کشاورزی',
  description: 'مدیریت هوشمند مزرعه با فناوری IoT و هوش مصنوعی',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#F9F8F6] dark:bg-[#121212] text-gray-800 dark:text-gray-200">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
