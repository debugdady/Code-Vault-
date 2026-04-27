import Link from 'next/link'
import { ArrowRight, Code, Search, Tags, Cloud, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Code,
    title: 'Syntax Highlighting',
    description: 'Beautiful code display with support for 50+ languages and automatic detection.',
  },
  {
    icon: Search,
    title: 'Instant Search',
    description: 'Find any snippet in seconds with powerful full-text search across all your code.',
  },
  {
    icon: Tags,
    title: 'Smart Organization',
    description: 'Tag and categorize snippets your way. Filter by language, tags, or favorites.',
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description: 'Access your snippets from anywhere. Your code vault is always with you.',
  },
  {
    icon: Zap,
    title: 'Quick Copy',
    description: 'One-click copying to clipboard. Paste your code exactly where you need it.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your snippets are encrypted and private by default. Share only when you want.',
  },
]

const previewSnippets = [
  { title: 'JWT Auth Middleware', language: 'TypeScript', color: 'bg-blue-500' },
  { title: 'MongoDB Connection', language: 'TypeScript', color: 'bg-blue-500' },
  { title: 'React Form Handler', language: 'TypeScript', color: 'bg-blue-500' },
  { title: 'Docker Compose Stack', language: 'YAML', color: 'bg-indigo-500' },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Now in Public Beta
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
              Your Cloud Vault for{' '}
              <span className="text-primary">Reusable Code</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Store, organize, and access your code snippets from anywhere. 
              Find snippets in seconds with powerful search and smart tagging.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-border bg-card p-4 shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-muted-foreground ml-2">CodeVault Dashboard</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {previewSnippets.map((snippet) => (
                  <div
                    key={snippet.title}
                    className="p-3 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Badge className={`${snippet.color} text-white text-xs mb-2`}>
                      {snippet.language}
                    </Badge>
                    <p className="text-sm font-medium text-foreground truncate">
                      {snippet.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Everything you need to manage your code snippets
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for developers who want to work smarter, not harder.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="p-2 w-fit bg-primary/10 rounded-lg mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border bg-card/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to organize your code?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of developers who use CodeVault to store and manage their code snippets.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/login">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
