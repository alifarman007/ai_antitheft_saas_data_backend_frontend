'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { useAuthContext } from "@/components/auth-provider"

export default function LoginPage() {
  const [email, setEmail] = useState("arafat.adi@sysnova.com")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { login, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(email, password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setLoading(false)
  }
  return (
    <div className="min-h-screen relative flex items-center justify-center p-3 sm:p-4">
      {/* Background Image */}
      <Image src="/background.png" alt="AI Facial Recognition Background" fill className="object-cover" priority />

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Back to Home Link */}
      <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Button variant="ghost" className="text-white hover:bg-white/10 gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </Link>

      {/* Logo */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div className="text-white hidden sm:block">
            <div className="font-bold text-sm sm:text-lg">AI Face</div>
            <div className="font-bold text-sm sm:text-lg">Reidentification</div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl mx-2 sm:mx-0">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">Sign In</h1>
            <p className="text-sm sm:text-base text-gray-600">Please Enter Your Password</p>
            <p className="text-sm sm:text-base text-gray-600">to Get Signed In</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="arafat.adi@sysnova.com"
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 bg-gray-50 text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 bg-gray-50 text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-xs sm:text-sm text-gray-600">
                  Remember Me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-xs sm:text-sm text-gray-600 hover:text-purple-600">
                Forgot Password ?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-10 sm:h-12 bg-purple-600 hover:bg-purple-700 rounded-lg sm:rounded-xl text-white font-medium text-sm sm:text-base"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
