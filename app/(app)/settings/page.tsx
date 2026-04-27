'use client'

import { useState } from 'react'
import { User, Moon, Sun, Bell, Shield, Trash2, LogOut } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { FieldGroup, Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { mockUser } from '@/lib/mock-data'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SettingsPage() {
  const [name, setName] = useState(mockUser.name)
  const [email, setEmail] = useState(mockUser.email)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Profile updated successfully')
    setIsSaving(false)
  }

  const handleDeleteAccount = () => {
    toast.success('Account deletion requested')
    setShowDeleteAccount(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label: 'Settings' }]} />

      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Manage your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback className="text-2xl">{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary border-border max-w-md"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border max-w-md"
              />
            </Field>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how CodeVault looks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme across the app</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked)
                  document.documentElement.classList.toggle('dark', checked)
                  toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`)
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Show Line Numbers</p>
                <p className="text-sm text-muted-foreground">Display line numbers in code blocks</p>
              </div>
              <Switch checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Configure your workspace preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates about your snippets</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Auto-save</p>
                <p className="text-sm text-muted-foreground">Automatically save snippets while editing</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                className="bg-secondary border-border max-w-md"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                className="bg-secondary border-border max-w-md"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-new-password">Confirm New Password</FieldLabel>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Confirm new password"
                className="bg-secondary border-border max-w-md"
              />
            </Field>
            <Button variant="outline">Update Password</Button>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/50">
            <div>
              <p className="font-medium text-foreground">Log Out</p>
              <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteAccount(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteAccount}
        onOpenChange={setShowDeleteAccount}
        title="Delete Account"
        description="This action cannot be undone. All your snippets, tags, and account data will be permanently deleted."
        confirmLabel="Delete My Account"
        onConfirm={handleDeleteAccount}
        variant="destructive"
      />
    </div>
  )
}
