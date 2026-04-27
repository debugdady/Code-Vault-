'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FileCode, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search-bar'
import { FilterChips } from '@/components/filter-chips'
import { SortDropdown, type SortOption } from '@/components/sort-dropdown'
import { SnippetCard } from '@/components/snippet-card'
import { EmptyState } from '@/components/empty-state'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { LANGUAGES } from '@/lib/types'
import { toast } from 'sonner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAuth } from '@/components/auth-provider'
import { getUserSnippets, deleteSnippet, toggleFavorite } from '@/lib/snippets'
import type { Snippet } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'

const languageFilters = LANGUAGES.slice(0, 6).map((l) => ({ id: l.value, label: l.label }))

export default function SnippetsPage() {
  const { user } = useAuth()
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Extract unique tags from snippets
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    snippets.forEach((s) => s.tags.forEach((t) => tags.add(t)))
    return Array.from(tags)
      .sort()
      .slice(0, 6)
      .map((name) => ({ id: name, label: name }))
  }, [snippets])

  useEffect(() => {
    async function loadSnippets() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const data = await getUserSnippets(user.uid)
        setSnippets(data)
      } catch (error) {
        console.error('Failed to load snippets:', error)
        toast.error('Failed to load snippets')
      } finally {
        setLoading(false)
      }
    }

    loadSnippets()
  }, [user])

  const filteredSnippets = useMemo(() => {
    let result = [...snippets]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower) ||
          s.code.toLowerCase().includes(searchLower) ||
          s.tags.join(' ').toLowerCase().includes(searchLower)
      )
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      result = result.filter((s) => selectedLanguages.includes(s.language))
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((s) => s.tags.some((t) => selectedTags.includes(t)))
    }

    // Favorites filter
    if (showFavorites) {
      result = result.filter((s) => s.isFavorite)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'language':
        result.sort((a, b) => a.language.localeCompare(b.language))
        break
    }

    return result
  }, [snippets, search, selectedLanguages, selectedTags, showFavorites, sortBy])

  const handleToggleFavorite = async (id: string) => {
    try {
      const snippet = snippets.find((s) => s.id === id)
      if (!snippet) return

      await toggleFavorite(id, snippet.isFavorite)
      setSnippets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
      )
      toast.success(snippet.isFavorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const snippet = snippets.find((s) => s.id === id)
      await deleteSnippet(id)
      setSnippets((prev) => prev.filter((s) => s.id !== id))
      toast.success(`Deleted "${snippet?.title}"`)
    } catch (error) {
      toast.error('Failed to delete snippet')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Snippets' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Snippets</h1>
          <p className="text-muted-foreground mt-1">
            {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button asChild>
          <Link href="/snippets/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Snippet
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar value={search} onChange={setSearch} className="flex-1" />
          <div className="flex items-center gap-2">
            <SortDropdown value={sortBy} onChange={setSortBy} />
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Language:</span>
            <FilterChips chips={languageFilters} selected={selectedLanguages} onChange={setSelectedLanguages} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tags:</span>
            <FilterChips chips={allTags} selected={selectedTags} onChange={setSelectedTags} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showFavorites ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            Favorites Only
          </Button>
          {(selectedLanguages.length > 0 || selectedTags.length > 0 || showFavorites || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedLanguages([])
                setSelectedTags([])
                setShowFavorites(false)
                setSearch('')
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Snippets Grid/List */}
      {filteredSnippets.length === 0 ? (
        <EmptyState
          icon={FileCode}
          title="No snippets found"
          description={search || selectedLanguages.length > 0 || selectedTags.length > 0 || showFavorites ? 'Try adjusting your search or filters.' : 'Create your first snippet to get started.'}
          actionLabel="Add Snippet"
          actionHref="/snippets/new"
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
