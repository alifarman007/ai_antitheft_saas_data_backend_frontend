import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Shield, Camera, BarChart3, Eye, Mail, Bell } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Mail,
      title: "Instant Email Alerts",
      description: "Get immediate email notifications the moment a person is detected by your cameras",
    },
    {
      icon: Bell,
      title: "Real-time Detection",
      description: "Lightning-fast person detection with instant alerts sent directly to your inbox",
    },
    {
      icon: Eye,
      title: "Advanced Recognition",
      description: "Accurate face detection and identification with advanced AI algorithms",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with encrypted data storage and processing",
    },
    {
      icon: Camera,
      title: "Multi-Camera Support",
      description: "Connect and monitor multiple cameras from a single dashboard",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reporting on detection activities",
    },
  ]

  const pricingPlans = [
    {
      name: "Basic",
      price: "$100",
      period: "/month",
      description: "Perfect for home security with webcam support",
      features: [
        "Webcam support included",
        "Up to 50 registered faces",
        "Instant email notifications",
        "Basic dashboard access",
        "Email support",
        "Standard recognition accuracy",
        "30-day data retention",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Standard",
      price: "$500",
      period: "/month",
      description: "Ideal for small businesses with 1 professional camera",
      features: [
        "1 professional camera connection",
        "Up to 200 registered faces",
        "Instant email notifications",
        "Advanced dashboard",
        "Priority email support",
        "High accuracy recognition",
        "60-day data retention",
        "Real-time alerts",
        "Custom notification settings",
      ],
      buttonText: "Get Started",
      popular: true,
    },
    {
      name: "Premium",
      price: "$1,400",
      period: "/month",
      description: "Best for growing businesses with 2 professional cameras",
      features: [
        "2 professional camera connections",
        "Unlimited registered faces",
        "Instant email notifications",
        "Full dashboard access",
        "24/7 phone & email support",
        "Premium accuracy recognition",
        "90-day data retention",
        "Real-time alerts & notifications",
        "Advanced analytics",
        "Custom integrations",
        "Priority processing",
      ],
      buttonText: "Get Started",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-sm sm:text-xl font-bold text-gray-900 truncate">AI Face Reidentification</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 px-2 sm:px-4">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm px-3 sm:px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
              Instant Email Notifications
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Get Instant Alerts When
              <span className="text-purple-600 block">Anyone is Detected</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Advanced AI face recognition that sends immediate email notifications the moment a person is detected.
              Never miss an important security event again with real-time alerts delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-3 text-base sm:text-lg"
                >
                  Start Monitoring Now
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg border-purple-200 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Instant Notifications, Advanced Security
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Get immediate email alerts when anyone is detected, with powerful AI-driven face recognition technology
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Simple setup, instant results. Get notified immediately when anyone is detected.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1. Connect Your Camera</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">
                Set up your webcam or professional camera with our easy-to-use dashboard
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2. AI Detects Person</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">
                Our advanced AI continuously monitors and instantly detects when anyone appears
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3. Get Instant Email</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">
                Receive immediate email notification with detection details and timestamp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Professional Security Plans
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Choose the perfect plan for your security needs. All plans include instant email notifications.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 ${
                  plan.popular ? "border-purple-500 shadow-xl" : "border-gray-200"
                } hover:shadow-lg transition-shadow`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4 p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-3 sm:mt-4">
                    <span className="text-2xl sm:text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-sm sm:text-base text-gray-600">{plan.period}</span>}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-0 p-4 sm:p-6">
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button
                      className={`w-full text-sm sm:text-base ${
                        plan.popular ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Never Miss a Security Event Again
          </h2>
          <p className="text-base sm:text-xl text-purple-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join businesses worldwide who trust AI Face Reidentification for instant person detection alerts. Get
            notified immediately when anyone is detected.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg"
              >
                Start Monitoring Today
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-purple-600 px-6 sm:px-8 py-3 text-base sm:text-lg bg-transparent"
              >
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">AI Face Reidentification</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400 max-w-md">
                Get instant email notifications when anyone is detected. Advanced AI-powered face recognition for
                immediate security alerts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 AI Face Reidentification. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
