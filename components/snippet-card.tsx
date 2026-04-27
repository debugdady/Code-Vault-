'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Copy, Pencil, Trash2, Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CodeViewer } from '@/components/code-viewer'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Snippet } from '@/lib/types'
import { LANGUAGES } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SnippetCardProps {
  snippet: Snippet
  onToggleFavorite?: (id: string) => void
  onDelete?: (id: string) => void
}

export function SnippetCard({ snippet, onToggleFavorite, onDelete }: SnippetCardProps) {
  const [copied, setCopied] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const languageConfig = LANGUAGES.find((l) => l.value === snippet.language)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(snippet.id)
  }

  const handleDelete = () => {
    onDelete?.(snippet.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5 bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link href={`/snippets/${snippet.id}`} className="block">
                <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">
                  {snippet.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {snippet.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'shrink-0 transition-colors',
                snippet.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
              )}
              onClick={handleFavorite}
            >
              <Heart className={cn('h-4 w-4', snippet.isFavorite && 'fill-current')} />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge variant="secondary" className={cn('text-xs', languageConfig?.color, 'text-white')}>
              {languageConfig?.label || snippet.language}
            </Badge>
            {snippet.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {snippet.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{snippet.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md overflow-hidden border border-border">
            <CodeViewer
              code={snippet.code.split('\n').slice(0, 6).join('\n')}
              language={snippet.language}
              showLineNumbers={false}
              maxHeight="120px"
            />
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/snippets/${snippet.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault()
                  setShowDeleteDialog(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Snippet"
        description={`Are you sure you want to delete "${snippet.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  )
}
