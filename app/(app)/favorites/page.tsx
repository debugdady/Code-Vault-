'use client'

import { useState, useMemo, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'
import { SnippetCard } from '@/components/snippet-card'
import { EmptyState } from '@/components/empty-state'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-provider'
import { getUserSnippets, deleteSnippet, toggleFavorite } from '@/lib/snippets'
import type { Snippet } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'

export default function FavoritesPage() {
  const { user } = useAuth()
  const [allSnippets, setAllSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadSnippets() {
      if (!user) return
      try {
        const data = await getUserSnippets(user.uid)
        setAllSnippets(data)
      } catch (error) {
        console.error('Failed to load snippets:', error)
        toast.error('Failed to load snippets')
      } finally {
        setLoading(false)
      }
    }

    loadSnippets()
  }, [user])

  const favoriteSnippets = useMemo(() => {
    let result = allSnippets.filter((s) => s.isFavorite)

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [allSnippets, search])

  const handleToggleFavorite = async (id: string) => {
    try {
      const snippet = allSnippets.find((s) => s.id === id)
      if (!snippet) return
      
      await toggleFavorite(id, snippet.isFavorite)
      setAllSnippets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
      )
      toast.success('Removed from favorites')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const snippet = allSnippets.find((s) => s.id === id)
      await deleteSnippet(id)
      setAllSnippets((prev) => prev.filter((s) => s.id !== id))
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
      <Breadcrumbs items={[{ label: 'Favorites' }]} />

      <div>
        <h1 className="text-3xl font-bold text-foreground">Favorites</h1>
        <p className="text-muted-foreground mt-1">
          Your starred snippets for quick access
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search favorites..."
        className="max-w-md"
      />

      {favoriteSnippets.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={search ? 'No matching favorites' : 'No favorites yet'}
          description={
            search
              ? 'Try adjusting your search terms.'
              : 'Star your most-used snippets to see them here for quick access.'
          }
          actionLabel="Browse Snippets"
          actionHref="/snippets"
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {favoriteSnippets.length} favorite{favoriteSnippets.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {favoriteSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
