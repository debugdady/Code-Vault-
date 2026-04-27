import { FileCode, Heart, Pencil, Trash2 } from 'lucide-react'
import type { Activity } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
  activities: Activity[]
  className?: string
}

const activityIcons = {
  created: FileCode,
  updated: Pencil,
  deleted: Trash2,
  favorited: Heart,
}

const activityLabels = {
  created: 'Created',
  updated: 'Updated',
  deleted: 'Deleted',
  favorited: 'Favorited',
}

const activityColors = {
  created: 'text-green-500 bg-green-500/10',
  updated: 'text-blue-500 bg-blue-500/10',
  deleted: 'text-red-500 bg-red-500/10',
  favorited: 'text-pink-500 bg-pink-500/10',
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type]
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg', activityColors[activity.type])}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activityLabels[activity.type]}</span>{' '}
                <span className="text-muted-foreground truncate">{activity.snippetTitle}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
