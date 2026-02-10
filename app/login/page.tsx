'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (login(username, password)) {
      toast({
        title: 'Login successful',
        description: 'Redirecting to dashboard...',
        className: 'bg-green-500 text-white',
      })
      router.push('/admin')
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600/20 rounded-2xl mb-4 group transition-all duration-300 hover:scale-110">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/50" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Please enter your credentials to continue</p>
        </div>

        <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl">Admin Access</CardTitle>
            <CardDescription className="text-gray-500 text-xs">
              Secure portal for management and operations
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-gray-300 text-xs font-semibold ml-1">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white h-12 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-gray-600"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-gray-300 text-xs font-semibold">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white h-12 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-gray-600"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Checking...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-xs">
          © 2025 dresscode laundry systems. All rights reserved.
        </p>
      </div>
    </div>
  )
}
