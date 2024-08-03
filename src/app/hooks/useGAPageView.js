// app/hooks/useGAPageView.js
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useGAPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + searchParams.toString()
      window.gtag('event', 'page_view', {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [pathname, searchParams])
}
