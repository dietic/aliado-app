'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ThemedImage({
  alt,
  lightSrc,
  darkSrc,
  ...props
}: {
  alt: string
  lightSrc: string
  darkSrc: string
  [key: string]: any
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <Image src={resolvedTheme === 'dark' ? darkSrc : lightSrc} alt={alt} {...props} />
}
