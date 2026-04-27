import type { Snippet, Tag, Activity, User } from './types'

export const mockUser: User = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
}

export const mockTags: Tag[] = [
  { id: '1', name: 'api', color: 'bg-blue-500', count: 8 },
  { id: '2', name: 'auth', color: 'bg-green-500', count: 5 },
  { id: '3', name: 'database', color: 'bg-purple-500', count: 6 },
  { id: '4', name: 'react', color: 'bg-cyan-500', count: 12 },
  { id: '5', name: 'utils', color: 'bg-yellow-500', count: 15 },
  { id: '6', name: 'docker', color: 'bg-sky-500', count: 3 },
  { id: '7', name: 'testing', color: 'bg-pink-500', count: 4 },
  { id: '8', name: 'config', color: 'bg-orange-500', count: 7 },
]

export const mockSnippets: Snippet[] = [
  {
    id: '1',
    title: 'JWT Auth Middleware',
    language: 'typescript',
    description: 'Express middleware for JWT token verification with role-based access control.',
    tags: ['auth', 'api'],
    code: `import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
  role: string
}

export const authMiddleware = (allowedRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      req.user = decoded
      
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }
      
      next()
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}`,
    isFavorite: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: '2',
    title: 'MongoDB Connection',
    language: 'typescript',
    description: 'Reusable MongoDB connection with connection pooling and error handling.',
    tags: ['database', 'config'],
    code: `import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}`,
    isFavorite: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T09:30:00Z',
  },
  {
    id: '3',
    title: 'Axios API Client',
    language: 'typescript',
    description: 'Configured Axios instance with interceptors for auth and error handling.',
    tags: ['api', 'utils'],
    code: `import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient`,
    isFavorite: false,
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-12T11:15:00Z',
  },
  {
    id: '4',
    title: 'React Form Handler',
    language: 'typescript',
    description: 'Custom React hook for form state management with validation.',
    tags: ['react', 'utils'],
    code: `import { useState, useCallback } from 'react'

interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate: (values: T) => Partial<Record<keyof T, string>>
) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
  })

  const handleChange = useCallback((field: keyof T, value: any) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }))
  }, [])

  const handleBlur = useCallback((field: keyof T) => {
    setState((prev) => {
      const errors = validate(prev.values)
      return {
        ...prev,
        touched: { ...prev.touched, [field]: true },
        errors,
      }
    })
  }, [validate])

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
      e.preventDefault()
      const errors = validate(state.values)
      if (Object.keys(errors).length === 0) {
        onSubmit(state.values)
      } else {
        setState((prev) => ({ ...prev, errors }))
      }
    },
    [state.values, validate]
  )

  return { ...state, handleChange, handleBlur, handleSubmit }
}`,
    isFavorite: true,
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
  },
  {
    id: '5',
    title: 'Email Validation Regex',
    language: 'typescript',
    description: 'RFC 5322 compliant email validation regex pattern with helper function.',
    tags: ['utils'],
    code: `// RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  if (email.length > 254) {
    return false
  }
  
  return EMAIL_REGEX.test(email)
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email is required' }
  }
  
  if (!isValidEmail(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  
  return { valid: true }
}`,
    isFavorite: false,
    createdAt: '2024-01-05T09:30:00Z',
    updatedAt: '2024-01-05T09:30:00Z',
  },
  {
    id: '6',
    title: 'Docker Compose Dev Stack',
    language: 'yaml',
    description: 'Development environment with PostgreSQL, Redis, and app service.',
    tags: ['docker', 'config'],
    code: `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`,
    isFavorite: false,
    createdAt: '2024-01-03T14:00:00Z',
    updatedAt: '2024-01-17T11:00:00Z',
  },
  {
    id: '7',
    title: 'SQL Join Query Examples',
    language: 'sql',
    description: 'Common SQL join patterns with users, orders, and products.',
    tags: ['database'],
    code: `-- Inner Join: Get all orders with user details
SELECT 
  u.name AS customer_name,
  u.email,
  o.order_id,
  o.total_amount,
  o.created_at
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed';

-- Left Join: Get all users including those without orders
SELECT 
  u.name,
  COUNT(o.order_id) AS total_orders,
  COALESCE(SUM(o.total_amount), 0) AS lifetime_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY lifetime_value DESC;

-- Multiple Joins: Get order details with products
SELECT 
  o.order_id,
  u.name AS customer,
  p.name AS product,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS line_total
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
ORDER BY o.order_id;`,
    isFavorite: true,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-19T15:30:00Z',
  },
  {
    id: '8',
    title: 'Tailwind Card Component',
    language: 'typescript',
    description: 'Reusable card component with variants and hover effects.',
    tags: ['react', 'utils'],
    code: `import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'bordered' | 'elevated'
  hover?: boolean
  className?: string
}

export function Card({ 
  children, 
  variant = 'default', 
  hover = true,
  className 
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-200',
        {
          'bg-card': variant === 'default',
          'bg-card border border-border': variant === 'bordered',
          'bg-card shadow-lg': variant === 'elevated',
          'hover:shadow-xl hover:-translate-y-0.5': hover,
        },
        className
      )}
    >
      {children}
    </div>
  )
}`,
    isFavorite: false,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '9',
    title: 'Python FastAPI CRUD',
    language: 'python',
    description: 'Basic CRUD endpoints with FastAPI and Pydantic models.',
    tags: ['api', 'database'],
    code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

app = FastAPI()

class Item(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: float
    
items_db: dict[str, Item] = {}

@app.post("/items", response_model=Item)
def create_item(item: Item):
    item.id = str(uuid4())
    items_db[item.id] = item
    return item

@app.get("/items", response_model=List[Item])
def list_items():
    return list(items_db.values())

@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: str):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return items_db[item_id]

@app.delete("/items/{item_id}")
def delete_item(item_id: str):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    del items_db[item_id]
    return {"message": "Item deleted"}`,
    isFavorite: false,
    createdAt: '2023-12-28T12:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
  },
  {
    id: '10',
    title: 'Bash Deploy Script',
    language: 'bash',
    description: 'Production deployment script with health checks and rollback.',
    tags: ['docker', 'config'],
    code: `#!/bin/bash
set -e

APP_NAME="myapp"
IMAGE_TAG="\${1:-latest}"
HEALTH_CHECK_URL="http://localhost:3000/health"
MAX_RETRIES=30

echo "Deploying $APP_NAME:$IMAGE_TAG..."

# Pull latest image
docker pull "registry.example.com/$APP_NAME:$IMAGE_TAG"

# Stop existing container
docker stop "$APP_NAME" 2>/dev/null || true
docker rm "$APP_NAME" 2>/dev/null || true

# Start new container
docker run -d \\
  --name "$APP_NAME" \\
  --restart unless-stopped \\
  -p 3000:3000 \\
  --env-file .env.production \\
  "registry.example.com/$APP_NAME:$IMAGE_TAG"

# Health check
echo "Waiting for health check..."
for i in $(seq 1 $MAX_RETRIES); do
  if curl -sf "$HEALTH_CHECK_URL" > /dev/null; then
    echo "Deployment successful!"
    exit 0
  fi
  sleep 2
done

echo "Health check failed, rolling back..."
docker stop "$APP_NAME"
exit 1`,
    isFavorite: true,
    createdAt: '2023-12-25T16:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z',
  },
]

export const mockActivities: Activity[] = [
  { id: '1', type: 'created', snippetTitle: 'JWT Auth Middleware', timestamp: '2024-01-22T10:30:00Z' },
  { id: '2', type: 'favorited', snippetTitle: 'SQL Join Query Examples', timestamp: '2024-01-22T09:15:00Z' },
  { id: '3', type: 'updated', snippetTitle: 'React Form Handler', timestamp: '2024-01-21T16:45:00Z' },
  { id: '4', type: 'created', snippetTitle: 'Docker Compose Dev Stack', timestamp: '2024-01-21T14:00:00Z' },
  { id: '5', type: 'deleted', snippetTitle: 'Old Config File', timestamp: '2024-01-20T11:30:00Z' },
  { id: '6', type: 'updated', snippetTitle: 'MongoDB Connection', timestamp: '2024-01-20T09:00:00Z' },
]

export const languageStats = [
  { name: 'TypeScript', count: 45, fill: 'var(--chart-1)' },
  { name: 'Python', count: 22, fill: 'var(--chart-2)' },
  { name: 'SQL', count: 18, fill: 'var(--chart-3)' },
  { name: 'Bash', count: 12, fill: 'var(--chart-4)' },
  { name: 'Other', count: 8, fill: 'var(--chart-5)' },
]
