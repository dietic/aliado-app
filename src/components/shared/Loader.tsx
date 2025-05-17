import React from 'react'
import { cn } from '@/lib/utils' // if you're using a classnames util
import { Loader as LoaderIcon } from 'lucide-react'
type LoaderProps = {
  className?: string
}

const Loader = ({ className }: LoaderProps) => (
  <LoaderIcon className={cn('animate-spin -ml-1 mr-3 h-4 w-4 text-white', className)} />
)

export default Loader
