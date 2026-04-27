'use client'

import Link from 'next/link'
import { User, Settings, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/auth-provider'
import { logoutUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function ProfileMenu() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
            <AvatarFallback>
              {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.displayName || 'Unnamed User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground break-all">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Workspace Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}