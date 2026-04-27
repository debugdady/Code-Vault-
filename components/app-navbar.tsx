'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { ProfileMenu } from '@/components/profile-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { mockSnippets } from '@/lib/mock-data'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { LANGUAGES } from '@/lib/types'

export function AppNavbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSnippets = mockSnippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      
      <div className="flex-1" />
      
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-64 justify-start text-muted-foreground">
            <Search className="h-4 w-4 mr-2" />
            <span>Search snippets...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Snippets</DialogTitle>
          </DialogHeader>
          <div className="p-4 border-b border-border">
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary border-border"
              autoFocus
            />
          </div>
          <div className="max-h-80 overflow-auto p-2">
            {searchQuery && filteredSnippets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No snippets found</p>
            ) : searchQuery ? (
              filteredSnippets.slice(0, 5).map((snippet) => {
                const lang = LANGUAGES.find((l) => l.value === snippet.language)
                return (
                  <Link
                    key={snippet.id}
                    href={`/snippets/${snippet.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{snippet.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{snippet.description}</p>
                    </div>
                    <Badge className={`${lang?.color} text-white shrink-0`}>
                      {lang?.label || snippet.language}
                    </Badge>
                  </Link>
                )
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">Type to search snippets</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ThemeToggle />
      <ProfileMenu />
    </header>
  )
}
