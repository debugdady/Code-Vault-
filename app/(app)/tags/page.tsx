'use client'

import { useState, useEffect, useMemo } from 'react'
import { Tags, Search, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empty-state'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useAuth } from '@/components/auth-provider'
import { getUserSnippets, updateSnippet } from '@/lib/snippets'
import type { Snippet, Tag } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

const tagColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-red-500',
]

export default function TagsPage() {
  const { user } = useAuth()
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTagName, setDeleteTagName] = useState<string | null>(null)

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
        toast.error('Failed to load tags')
      } finally {
        setLoading(false)
      }
    }

    loadSnippets()
  }, [user])

  const tags: Tag[] = useMemo(() => {
    const tagMap = new Map<string, number>()

    snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => {
        const cleanTag = tag.trim().toLowerCase()
        if (cleanTag) {
          tagMap.set(cleanTag, (tagMap.get(cleanTag) || 0) + 1)
        }
      })
    })

    return Array.from(tagMap.entries()).map(([name, count], index) => ({
      id: name,
      name,
      count,
      color: tagColors[index % tagColors.length],
    }))
  }, [snippets])

  const filteredTags = useMemo(() => {
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [tags, search])

  const getSnippetsForTag = (tagName: string) => {
    return snippets.filter((s) =>
      s.tags.map((t) => t.toLowerCase()).includes(tagName.toLowerCase())
    )
  }

  const handleDeleteTag = async () => {
    if (!deleteTagName) return

    try {
      const affectedSnippets = snippets.filter((s) =>
        s.tags.map((t) => t.toLowerCase()).includes(deleteTagName.toLowerCase())
      )

      for (const snippet of affectedSnippets) {
        const updatedTags = snippet.tags.filter(
          (tag) => tag.toLowerCase() !== deleteTagName.toLowerCase()
        )

        await updateSnippet(snippet.id, {
          tags: updatedTags,
        })
      }

      const refreshed = snippets.map((snippet) => ({
        ...snippet,
        tags: snippet.tags.filter(
          (tag) => tag.toLowerCase() !== deleteTagName.toLowerCase()
        ),
      }))

      setSnippets(refreshed)
      toast.success(`Tag "${deleteTagName}" deleted from all snippets`)
      setDeleteTagName(null)
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete tag')
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
      <Breadcrumbs items={[{ label: 'Tags' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground mt-1">
            Automatically organized from your real snippet collection
          </p>
        </div>

        <Button variant="outline" disabled>
          {tags.length} Total Tag{tags.length !== 1 ? 's' : ''}
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tags..."
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {filteredTags.length === 0 ? (
        <EmptyState
          icon={Tags}
          title={search ? 'No matching tags' : 'No tags yet'}
          description={
            search
              ? 'Try adjusting your search terms.'
              : 'Tags will appear automatically when you add them to snippets.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTags.map((tag) => {
            const snippetsWithTag = getSnippetsForTag(tag.name)

            return (
              <Card
                key={tag.id}
                className="bg-card border-border hover:border-primary/50 transition-colors group"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-3 h-3 rounded-full', tag.color)} />
                      <span className="font-medium text-foreground">{tag.name}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTagName(tag.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    {snippetsWithTag.length} snippet{snippetsWithTag.length !== 1 ? 's' : ''}
                  </p>

                  {snippetsWithTag.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-1">
                        {snippetsWithTag.slice(0, 3).map((snippet) => (
                          <Badge key={snippet.id} variant="outline" className="text-xs" asChild>
                            <Link href={`/snippets/${snippet.id}`}>
                              {snippet.title.length > 15
                                ? snippet.title.slice(0, 15) + '...'
                                : snippet.title}
                            </Link>
                          </Badge>
                        ))}
                        {snippetsWithTag.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{snippetsWithTag.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTagName}
        onOpenChange={(open) => !open && setDeleteTagName(null)}
        title="Delete Tag"
        description={`Are you sure you want to remove "${deleteTagName}" from all snippets?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteTag}
        variant="destructive"
      />
    </div>
  )
}