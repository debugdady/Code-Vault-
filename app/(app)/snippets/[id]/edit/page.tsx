'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { EmptyState } from '@/components/empty-state'
import { FieldGroup, Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LANGUAGES } from '@/lib/types'
import { toast } from 'sonner'
import { FileCode } from 'lucide-react'
import { getSnippetById, updateSnippet } from '@/lib/snippets'
import type { Snippet } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/components/auth-provider'

export default function EditSnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    async function loadSnippet() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const data = await getSnippetById(id)

        if (data && data.userId !== user.uid) {
          toast.error('Unauthorized access')
          router.push('/snippets')
          return
        }

        if (data) {
          setSnippet(data)
          setTitle(data.title)
          setLanguage(data.language)
          setDescription(data.description)
          setCode(data.code)
          setTags(data.tags)
          setIsFavorite(data.isFavorite)
        }
      } catch (error) {
        console.error('Failed to load snippet:', error)
        toast.error('Failed to load snippet')
      } finally {
        setLoading(false)
      }
    }

    loadSnippet()
  }, [id, user, router])

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
          description="The snippet you're looking for doesn't exist or has been deleted."
          actionLabel="Back to Snippets"
          actionHref="/snippets"
        />
      </div>
    )
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !language || !code) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await updateSnippet(id, {
        title,
        language,
        description,
        code,
        tags,
        isFavorite,
      })
      toast.success('Snippet updated successfully!')
      router.push(`/snippets/${id}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to update snippet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs
        items={[
          { label: 'Snippets', href: '/snippets' },
          { label: snippet.title, href: `/snippets/${id}` },
          { label: 'Edit' },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Snippet</h1>
        <p className="text-muted-foreground mt-1">
          Update the details of your code snippet.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Snippet Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title *</FieldLabel>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., JWT Auth Middleware"
                  className="bg-secondary border-border"
                  required
                  disabled={isLoading}
                />
                <FieldDescription>A descriptive name for your snippet</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="language">Language *</FieldLabel>
                <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${lang.color}`} />
                          {lang.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>The programming language of your code</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this snippet do?"
                  className="bg-secondary border-border resize-none"
                  rows={3}
                  disabled={isLoading}
                />
                <FieldDescription>A brief explanation of the snippet's purpose</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="tags">Tags</FieldLabel>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Press Enter to add tags"
                  className="bg-secondary border-border"
                  disabled={isLoading}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-2">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <FieldDescription>Add tags to organize and find your snippets easily</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="code">Code *</FieldLabel>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="bg-secondary border-border font-mono text-sm resize-none"
                  rows={15}
                  required
                  disabled={isLoading}
                />
                <FieldDescription>The actual code for your snippet</FieldDescription>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <div>
                    <FieldLabel htmlFor="favorite" className="mb-0">Add to Favorites</FieldLabel>
                    <FieldDescription className="mt-1">Mark this snippet as a favorite for quick access</FieldDescription>
                  </div>
                  <Switch
                    id="favorite"
                    checked={isFavorite}
                    onCheckedChange={setIsFavorite}
                    disabled={isLoading}
                  />
                </div>
              </Field>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}