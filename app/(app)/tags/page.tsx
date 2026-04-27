'use client'

import { useState } from 'react'
import { Tags, Plus, Search, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empty-state'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { mockTags, mockSnippets } from '@/lib/mock-data'
import type { Tag } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
  const [tags, setTags] = useState<Tag[]>(mockTags)
  const [search, setSearch] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null)

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    const existingTag = tags.find(
      (t) => t.name.toLowerCase() === newTagName.trim().toLowerCase()
    )
    if (existingTag) {
      toast.error('Tag already exists')
      return
    }

    const newTag: Tag = {
      id: String(Date.now()),
      name: newTagName.trim().toLowerCase(),
      color: tagColors[Math.floor(Math.random() * tagColors.length)],
      count: 0,
    }

    setTags([...tags, newTag])
    setNewTagName('')
    toast.success(`Tag "${newTag.name}" created`)
  }

  const handleDeleteTag = () => {
    if (!deleteTagId) return
    const tag = tags.find((t) => t.id === deleteTagId)
    setTags(tags.filter((t) => t.id !== deleteTagId))
    toast.success(`Tag "${tag?.name}" deleted`)
    setDeleteTagId(null)
  }

  // Get snippets for a tag
  const getSnippetsForTag = (tagName: string) => {
    return mockSnippets.filter((s) => s.tags.includes(tagName))
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Tags' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground mt-1">
            Organize your snippets with tags
          </p>
        </div>
      </div>

      {/* Add Tag Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Create New Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTag} className="flex gap-3">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name..."
              className="bg-secondary border-border max-w-xs"
            />
            <Button type="submit" disabled={!newTagName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tags..."
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Tags Grid */}
      {filteredTags.length === 0 ? (
        <EmptyState
          icon={Tags}
          title={search ? 'No matching tags' : 'No tags yet'}
          description={
            search
              ? 'Try adjusting your search terms.'
              : 'Create tags to organize your snippets better.'
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
                      onClick={() => setDeleteTagId(tag.id)}
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
        open={!!deleteTagId}
        onOpenChange={(open) => !open && setDeleteTagId(null)}
        title="Delete Tag"
        description="Are you sure you want to delete this tag? Snippets with this tag will not be deleted, but the tag will be removed from them."
        confirmLabel="Delete"
        onConfirm={handleDeleteTag}
        variant="destructive"
      />
    </div>
  )
}
