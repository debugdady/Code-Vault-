export interface Snippet {
  id: string
  title: string
  language: string
  description: string
  tags: string[]
  code: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
  color: string
  count: number
}

export interface Activity {
  id: string
  type: 'created' | 'updated' | 'deleted' | 'favorited'
  snippetTitle: string
  timestamp: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}

export type Language = 
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'go'
  | 'rust'
  | 'sql'
  | 'bash'
  | 'css'
  | 'html'
  | 'json'
  | 'yaml'
  | 'dockerfile'
  | 'markdown'

export const LANGUAGES: { value: Language; label: string; color: string }[] = [
  { value: 'typescript', label: 'TypeScript', color: 'bg-blue-500' },
  { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-500' },
  { value: 'python', label: 'Python', color: 'bg-green-500' },
  { value: 'go', label: 'Go', color: 'bg-cyan-500' },
  { value: 'rust', label: 'Rust', color: 'bg-orange-500' },
  { value: 'sql', label: 'SQL', color: 'bg-purple-500' },
  { value: 'bash', label: 'Bash', color: 'bg-gray-500' },
  { value: 'css', label: 'CSS', color: 'bg-pink-500' },
  { value: 'html', label: 'HTML', color: 'bg-red-500' },
  { value: 'json', label: 'JSON', color: 'bg-emerald-500' },
  { value: 'yaml', label: 'YAML', color: 'bg-indigo-500' },
  { value: 'dockerfile', label: 'Dockerfile', color: 'bg-sky-500' },
  { value: 'markdown', label: 'Markdown', color: 'bg-slate-500' },
]
