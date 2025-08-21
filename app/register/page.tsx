'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check } from "lucide-react"
import { api } from "@/lib/api"
import { useAuthContext } from "@/components/auth-provider"

export default function RegisterPage() {
  const [selectedPackage, setSelectedPackage] = useState("Standard")
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    password: "",
    confirm_password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await api.register({
        ...formData,
        selected_package: selectedPackage
      })
      
      if (result.id) {
        // Registration successful, redirect to login
        router.push('/login?message=Registration successful, please login')
      } else {
        setError(result.detail || 'Registration failed')
      }
    } catch (error) {
      setError('Network error occurred')
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

      {/* Register Form */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl mx-2 sm:mx-0">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">Create Account</h1>
            <p className="text-sm sm:text-base text-gray-600">Fill the form below to</p>
            <p className="text-sm sm:text-base text-gray-600">Create an account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-xs sm:text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Full Name"
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 bg-gray-50 text-sm sm:text-base"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 bg-gray-50 text-sm sm:text-base"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-xs sm:text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="Phone Number"
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 bg-gray-50 text-sm sm:text-base"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-gray-700">
                Create Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create Password"
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 bg-gray-50 text-sm sm:text-base"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-xs sm:text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="Confirm Password"
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 bg-gray-50 text-sm sm:text-base"
                value={formData.confirm_password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs sm:text-sm font-medium text-gray-700">
                Choose Your Package
              </Label>
              <div className="grid grid-cols-1 gap-3">
                <div 
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedPackage === "Basic" 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => setSelectedPackage("Basic")}
                >
                  <input
                    type="radio"
                    id="basic"
                    name="package"
                    value="Basic"
                    className="sr-only"
                    checked={selectedPackage === "Basic"}
                    onChange={() => setSelectedPackage("Basic")}
                  />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">Basic</h3>
                      <p className="text-xs text-gray-600">Webcam support included</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-gray-900">$100</span>
                      <span className="text-xs text-gray-600">/month</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Perfect for home security</span>
                  </div>
                </div>

                <div 
                  className={`border rounded-lg p-3 cursor-pointer relative transition-all ${
                    selectedPackage === "Standard" 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => setSelectedPackage("Standard")}
                >
                  <div className="absolute -top-2 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    Most Popular
                  </div>
                  <input
                    type="radio"
                    id="standard"
                    name="package"
                    value="Standard"
                    className="sr-only"
                    checked={selectedPackage === "Standard"}
                    onChange={() => setSelectedPackage("Standard")}
                  />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">Standard</h3>
                      <p className="text-xs text-gray-600">1 professional camera</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-gray-900">$500</span>
                      <span className="text-xs text-gray-600">/month</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Ideal for small businesses</span>
                  </div>
                </div>

                <div 
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedPackage === "Premium" 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => setSelectedPackage("Premium")}
                >
                  <input
                    type="radio"
                    id="premium"
                    name="package"
                    value="Premium"
                    className="sr-only"
                    checked={selectedPackage === "Premium"}
                    onChange={() => setSelectedPackage("Premium")}
                  />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">Premium</h3>
                      <p className="text-xs text-gray-600">2 professional cameras</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-gray-900">$1,400</span>
                      <span className="text-xs text-gray-600">/month</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Best for growing businesses</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-12 bg-purple-600 hover:bg-purple-700 rounded-lg sm:rounded-xl text-white font-medium mt-4 sm:mt-6 text-sm sm:text-base"
            >
              {loading ? "Creating Account..." : "Submit"}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs text-gray-600">
              By signing up you accept our{" "}
              <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                Terms & Conditions
              </Link>
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
