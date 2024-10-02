'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { debounce } from 'lodash-es'

export default function SearchByFileName() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const currentQuery = searchParams.get('fileName')
    if (currentQuery) {
      setSearchQuery(currentQuery)
    }
  }, [searchParams])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams)
      if (query) {
        params.set('fileName', query)
      } else {
        params.delete('fileName')
      }
      router.push(`?${params.toString()}`)
    }, 250),
    [searchParams, router]
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    debouncedSearch(query)
  }

  return (
    <div className="relative min-w-[300px]">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        placeholder="Search by file name..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-8 pr-4"
      />
    </div>
  )
}