'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Pencil, Trash2, Copy, Check, Calendar, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { CodeViewer } from '@/components/code-viewer'
import { SnippetCard } from '@/components/snippet-card'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EmptyState } from '@/components/empty-state'
import { LANGUAGES } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { FileCode, Spinner as SpinnerIcon } from 'lucide-react'
import { getSnippetById, deleteSnippet, toggleFavorite, getUserSnippets } from '@/lib/snippets'
import type { Snippet } from '@/lib/types'
import { useAuth } from '@/components/auth-provider'
import { Spinner } from '@/components/ui/spinner'

export default function SnippetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [allSnippets, setAllSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    async function loadSnippet() {
        if (!user) {
          setLoading(false)
          return
        }
        
        try {
          if (data && user && data.userId !== user.uid) {
            toast.error('Unauthorized access')
            router.push('/snippets')
            return
          }
          setSnippet(data)

          if (user && data) {
            const allData = await getUserSnippets(user.uid)
            setAllSnippets(allData)
          }
        } catch (error) {
          console.error('Failed to load snippet:', error)
          toast.error('Failed to load snippet')
        } finally {
          setLoading(false)
        }
      }

      loadSnippet()
    }, [id, user])

  const languageConfig = LANGUAGES.find((l) => l.value === snippet?.language)

  // Get related snippets (same language or shared tags)
  const relatedSnippets = allSnippets
    .filter((s) => {
      if (s.id === id || !snippet) return false
      const sameLanguage = s.language === snippet.language
      const sharedTags = s.tags.some((t) => snippet.tags.includes(t))
      return sameLanguage || sharedTags
    })
    .slice(0, 3)

  const handleCopy = async () => {
    if (!snippet) return
    await navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggleFavorite = async (snippetId: string) => {
    try {
      const targetSnippet = allSnippets.find((s) => s.id === snippetId)
      if (!targetSnippet) return

      await toggleFavorite(snippetId, targetSnippet.isFavorite)

      if (snippet && snippet.id === snippetId) {
        setSnippet({ ...snippet, isFavorite: !snippet.isFavorite })
      }

      setAllSnippets((prev) =>
        prev.map((s) => (s.id === snippetId ? { ...s, isFavorite: !s.isFavorite } : s))
      )

      toast.success(targetSnippet.isFavorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSnippet(id)
      toast.success(`Deleted "${snippet?.title}"`)
      router.push('/snippets')
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

  if (!snippet) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Snippets', href: '/snippets' }, { label: 'Not Found' }]} />
        <EmptyState
          icon={FileCode}
          title="Snippet not found"
          description="The snippet you&apos;re looking for doesn&apos;t exist or has been deleted."
          actionLabel="Back to Snippets"
          actionHref="/snippets"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Snippets', href: '/snippets' }, { label: snippet.title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{snippet.title}</h1>
                <Badge className={cn('text-white', languageConfig?.color)}>
                  {languageConfig?.label || snippet.language}
                </Badge>
              </div>
              <p className="text-muted-foreground">{snippet.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'transition-colors',
                  snippet.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                )}
                onClick={() => handleToggleFavorite(snippet.id)}
              >
                <Heart className={cn('h-5 w-5', snippet.isFavorite && 'fill-current')} />
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/snippets/${snippet.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Code Block */}
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Code</CardTitle>
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <CodeViewer code={snippet.code} language={snippet.language} maxHeight="500px" />
            </CardContent>
          </Card>

          {/* Related Snippets */}
          {relatedSnippets.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Related Snippets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedSnippets.map((related) => (
                  <SnippetCard
                    key={related.id}
                    snippet={related}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Snippet Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="text-foreground">
                    {new Date(snippet.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="text-foreground">
                    {new Date(snippet.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {snippet.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/snippets/${snippet.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Snippet
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <ExternalLink className="h-4 w-4 mr-2" />
                Share Snippet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Snippet"
        description={`Are you sure you want to delete "${snippet.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
