'use client'

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Tag } from '@/lib/types'

interface TagPillProps {
  tag: Tag
  showCount?: boolean
  showDelete?: boolean
  onDelete?: (id: string) => void
  onClick?: (id: string) => void
  className?: string
}

export function TagPill({ tag, showCount = true, showDelete = false, onDelete, onClick, className }: TagPillProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'px-3 py-1.5 text-sm font-medium transition-colors',
        onClick && 'cursor-pointer hover:bg-primary hover:text-primary-foreground',
        className
      )}
      onClick={() => onClick?.(tag.id)}
    >
      <span className={cn('w-2 h-2 rounded-full mr-2', tag.color)} />
      {tag.name}
      {showCount && <span className="ml-2 text-muted-foreground">({tag.count})</span>}
      {showDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(tag.id)
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  )
}
