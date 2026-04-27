'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Code2, Cloud, Shield, Search, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { signup, login, signInWithGoogle } from '@/lib/auth'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth-provider'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(loginEmail, loginPassword)
      toast.success('Logged in successfully')
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.code?.includes('invalid-credential')
        ? 'Invalid email or password'
        : 'Failed to log in'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (signupPassword !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (signupPassword.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      await signup(signupEmail, signupPassword, signupName)
      toast.success('Account created successfully')
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.code?.includes('email-already-in-use')
        ? 'Email already in use'
        : err.message || 'Failed to create account'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setIsLoading(true)

    try {
      await signInWithGoogle()
      toast.success('Signed in with Google')
      router.push('/dashboard')
    } catch (err) {
      toast.error('Google sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border bg-secondary/20">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-primary shadow-lg">
              <Code2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">CodeVault</h1>
              <p className="text-muted-foreground">Cloud Powered Snippet Workspace</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight text-foreground max-w-xl">
            Store, organize and access your reusable code snippets from anywhere.
          </h2>

          <p className="mt-5 text-lg text-muted-foreground max-w-lg leading-relaxed">
            Built on Firebase cloud infrastructure with secure authentication, Firestore database synchronization, smart tag management and instant snippet retrieval.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10 max-w-xl">
            <div className="rounded-2xl border border-border bg-card p-5">
              <Cloud className="h-5 w-5 mb-3 text-primary" />
              <p className="font-semibold">Cloud Synced</p>
              <p className="text-sm text-muted-foreground mt-1">Realtime backend storage</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <Shield className="h-5 w-5 mb-3 text-primary" />
              <p className="font-semibold">Secure Auth</p>
              <p className="text-sm text-muted-foreground mt-1">Firebase authentication</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <Search className="h-5 w-5 mb-3 text-primary" />
              <p className="font-semibold">Instant Search</p>
              <p className="text-sm text-muted-foreground mt-1">Find snippets in seconds</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <Database className="h-5 w-5 mb-3 text-primary" />
              <p className="font-semibold">Persistent Vault</p>
              <p className="text-sm text-muted-foreground mt-1">Always available online</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Cloud Computing Academic Project • Firebase + Next.js + Firestore
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md bg-card border-border shadow-2xl">
          <CardHeader className="text-center">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-primary">
                <Code2 className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your cloud snippet vault
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              variant="outline"
              className="w-full mb-6"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="bg-secondary border-border" />
                    </Field>
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <Input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-secondary border-border" />
                    </Field>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </FieldGroup>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Full Name</FieldLabel>
                      <Input value={signupName} onChange={(e) => setSignupName(e.target.value)} className="bg-secondary border-border" />
                    </Field>
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="bg-secondary border-border" />
                    </Field>
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <Input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="bg-secondary border-border" />
                    </Field>
                    <Field>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-secondary border-border" />
                    </Field>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </FieldGroup>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}