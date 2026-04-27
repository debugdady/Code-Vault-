'use client'

import { useState, useEffect } from 'react'
import {
  User,
  Moon,
  Sun,
  LogOut,
  Mail,
  Calendar,
  Database,
  Heart,
  Tags,
  FileCode,
  Save,
  Cloud,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FieldGroup, Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-provider'
import { auth } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import { logoutUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { getUserSnippets } from '@/lib/snippets'
import type { Snippet } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [name, setName] = useState(user?.displayName || '')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!user) {
        setLoadingStats(false)
        return
      }

      try {
        const data = await getUserSnippets(user.uid)
        setSnippets(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingStats(false)
      }
    }

    loadStats()
  }, [user])

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return

    setIsSavingProfile(true)
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
      })
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const totalSnippets = snippets.length
  const favoriteSnippets = snippets.filter((s) => s.isFavorite).length
  const totalTags = new Set(snippets.flatMap((s) => s.tags)).size
  const languageCount = new Set(snippets.map((s) => s.language)).size

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Settings' }]} />

      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Your personal cloud workspace controls
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Connected Firebase authentication profile
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-5 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {user?.displayName || 'Unnamed User'}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel>Display Name</FieldLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border max-w-md"
                  />
                  <FieldDescription>
                    Update how your name appears inside the vault
                  </FieldDescription>
                </Field>

                <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Appearance
              </CardTitle>
              <CardDescription>
                Instantly switch the global application theme
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setTheme('dark')
                    toast.success('Dark mode enabled')
                  }}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/30'
                  }`}
                >
                  <Moon className="h-5 w-5 mb-3" />
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ideal for coding at night
                  </p>
                </button>

                <button
                  onClick={() => {
                    setTheme('light')
                    toast.success('Light mode enabled')
                  }}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/30'
                  }`}
                >
                  <Sun className="h-5 w-5 mb-3" />
                  <p className="font-medium">Light Mode</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bright clean workspace
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Cloud Session
              </CardTitle>
              <CardDescription>
                Your live backend connection status
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-secondary/40 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Firebase Authentication</p>
                  <p className="text-sm text-muted-foreground">Connected and authenticated</p>
                </div>
                <span className="text-sm font-medium text-green-500">Online</span>
              </div>

              <div className="rounded-lg border border-border bg-secondary/40 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Firestore Database</p>
                  <p className="text-sm text-muted-foreground">Cloud snippet synchronization active</p>
                </div>
                <span className="text-sm font-medium text-green-500">Synced</span>
              </div>

              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out of Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>
                Live authenticated metadata
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium break-all">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Created On</p>
                  <p className="text-sm font-medium">
                    {user?.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : 'Unavailable'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email Verified</p>
                  <p className="text-sm font-medium">
                    {user?.emailVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Workspace Statistics</CardTitle>
              <CardDescription>
                Real-time cloud usage summary
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span>Total Snippets</span>
                </div>
                <span className="font-semibold">{totalSnippets}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span>Favorites</span>
                </div>
                <span className="font-semibold">{favoriteSnippets}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  <span>Total Tags</span>
                </div>
                <span className="font-semibold">{totalTags}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>Languages Used</span>
                </div>
                <span className="font-semibold">{languageCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}