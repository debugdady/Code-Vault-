'use client'

import Link from 'next/link'
import { FileCode, Heart, Code, Clock, Plus, Upload, Tags } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/stat-card'
import { SnippetCard } from '@/components/snippet-card'
import { ActivityFeed } from '@/components/activity-feed'
import { useAuth } from '@/components/auth-provider'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { getUserSnippets, deleteSnippet, toggleFavorite } from '@/lib/snippets'
import type { Snippet, Activity } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSnippets() {
      if (!user) return
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

  const totalSnippets = snippets.length
  const favoriteCount = snippets.filter((s) => s.isFavorite).length
  const languageCount = new Set(snippets.map((s) => s.language)).size
  const recentCount = snippets.filter((s) => {
    const updated = new Date(s.updatedAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return updated > weekAgo
  }).length

  // Calculate language statistics
  const languageCounts: Record<string, number> = {}
  snippets.forEach((s) => {
    languageCounts[s.language] = (languageCounts[s.language] || 0) + 1
  })

  const languageStats = Object.entries(languageCounts)
    .map(([name, count], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
      fill: `var(--chart-${(index % 5) + 1})`,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Generate activity from snippets
  const mockActivities: Activity[] = snippets
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map((snippet, index) => ({
      id: snippet.id,
      type: 'updated' as const,
      snippetTitle: snippet.title,
      timestamp: snippet.updatedAt,
    }))

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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your code vault.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Snippets"
          value={totalSnippets}
          icon={FileCode}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Favorites"
          value={favoriteCount}
          icon={Heart}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Languages"
          value={languageCount}
          icon={Code}
          description="Unique languages"
        />
        <StatCard
          title="Recent Updates"
          value={recentCount}
          icon={Clock}
          description="Last 7 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/snippets/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Snippet
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Import Snippet
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/tags">
                <Tags className="h-4 w-4 mr-2" />
                Manage Tags
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Languages</CardTitle>
          </CardHeader>
          <CardContent>
            {languageStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={languageStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {languageStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.16 0.01 260)',
                      border: '1px solid oklch(0.28 0.01 260)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'oklch(0.95 0 0)' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No snippets yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {mockActivities.length > 0 ? (
              <ActivityFeed activities={mockActivities} />
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No activity yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Snippets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Snippets</h2>
          <Button variant="ghost" asChild>
            <Link href="/snippets">View All</Link>
          </Button>
        </div>
        {snippets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No snippets yet</p>
            <Button asChild>
              <Link href="/snippets/new">Create Your First Snippet</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {snippets.slice(0, 6).map((snippet) => (
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
    </div>
  )
}
