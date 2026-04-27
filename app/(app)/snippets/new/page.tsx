'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/breadcrumbs'
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
import { useAuth } from '@/components/auth-provider'
import { createSnippet } from '@/lib/snippets'

export default function NewSnippetPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)

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

    if (!user) {
      toast.error('You must be logged in to create a snippet')
      return
    }

    setIsLoading(true)
    try {
      await createSnippet(user.uid, {
        title,
        language,
        description,
        code,
        tags,
        isFavorite,
      })
      toast.success('Snippet created successfully!')
      router.push('/snippets')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create snippet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs items={[{ label: 'Snippets', href: '/snippets' }, { label: 'New Snippet' }]} />

      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Snippet</h1>
        <p className="text-muted-foreground mt-1">
          Create a new code snippet to save in your vault.
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
                <FieldDescription>A brief explanation of the snippet&apos;s purpose</FieldDescription>
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
                  {isLoading ? 'Saving...' : 'Save Snippet'}
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
