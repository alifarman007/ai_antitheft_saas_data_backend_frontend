"use client"

import { useState, useEffect } from "react"
import { Bell, Camera, Upload, FileText, Grid3X3, User, Menu, X, UserCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuthContext } from "@/components/auth-provider"
import { api, Camera as CameraType, RegisteredFace, DetectionLog } from "@/lib/api"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cameras, setCameras] = useState<CameraType[]>([])
  const [faces, setFaces] = useState<RegisteredFace[]>([])
  const [stats, setStats] = useState({
    total_alerts_today: "00",
    total_registered_faces: "00"
  })
  const [loading, setLoading] = useState(true)
  
  const { user, logout } = useAuthContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [camerasData, facesData, statsData] = await Promise.all([
          api.getCameras(),
          api.getFaces(),
          api.getDashboardStats()
        ])
        
        setCameras(camerasData)
        setFaces(facesData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statsDisplay = [
    {
      number: stats.total_alerts_today,
      label: "Total Alerts Today",
      icon: Bell,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      number: stats.total_registered_faces,
      label: "Number of Registered Faces",
      icon: User,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500'
      case 'inactive':
        return 'bg-red-500'
      case 'disabled':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-purple-600 text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">AI Facial</div>
                <div className="font-bold text-xs sm:text-sm">Recognition</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-purple-700 rounded-lg">
            <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Dashboard</span>
          </div>
          <Link href="/dashboard/camera-configuration" onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Camera Configuration</span>
            </div>
          </Link>
          <Link href="/dashboard/face-upload" onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Face Image Upload</span>
            </div>
          </Link>
          <Link href="/dashboard/notifications" onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Notification & Log</span>
            </div>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold text-purple-600">Dashboard</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="text-xs">
                    {user?.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right hidden sm:block">
                  <div className="font-medium text-xs sm:text-sm">{user?.full_name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                  className="ml-2 text-xs"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statsDisplay.map((stat, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl sm:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">{stat.number}</div>
                      <div className="text-gray-600 text-xs sm:text-sm font-medium">{stat.label}</div>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}
                    >
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Camera Status */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">All Camera Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {cameras.map((camera) => (
                <Card key={camera.id} className="bg-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-purple-600">{camera.camera_name}</h3>
                      <Badge
                        className={`${getStatusColor(camera.status)} text-white hover:${getStatusColor(camera.status)} text-xs sm:text-sm`}
                      >
                        {camera.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Brand:</span>
                        <span>{camera.camera_brand}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Type:</span>
                        <Badge variant="outline" className="text-xs">
                          {camera.camera_type === 'ip_camera' ? 'IP Camera' : 'Webcam'}
                        </Badge>
                      </div>
                      
                      {camera.camera_type === 'ip_camera' && camera.ip_address && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">IP Address:</span>
                            <span className="font-mono text-xs">{camera.ip_address}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Port:</span>
                            <span className="font-mono text-xs">{camera.port}</span>
                          </div>
                          
                          {camera.username && (
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Username:</span>
                              <span className="font-mono text-xs">{camera.username}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Faces Register */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Faces Register</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {faces.map((face, index) => (
                <Card key={index} className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                        <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate w-full">{face.face_name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
