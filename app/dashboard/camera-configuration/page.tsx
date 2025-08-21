'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Bell, Camera, Upload, FileText, Grid3X3 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuthContext } from "@/components/auth-provider"
import { api, Camera as CameraType } from "@/lib/api"

export default function CameraConfigurationPage() {
  const [cameraType, setCameraType] = useState("")
  const [cameraBrand, setCameraBrand] = useState("")
  const [cameras, setCameras] = useState<CameraType[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    camera_name: "",
    ip_address: "",
    port: "",
    username: "",
    password: ""
  })
  
  const { user, logout } = useAuthContext()

  useEffect(() => {
    fetchCameras()
  }, [])

  const fetchCameras = async () => {
    try {
      const data = await api.getCameras()
      setCameras(data)
    } catch (error) {
      console.error('Error fetching cameras:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.createCamera({
        camera_name: formData.camera_name,
        camera_brand: cameraBrand,
        camera_type: cameraType,
        ip_address: cameraType === 'ip_camera' ? formData.ip_address : undefined,
        port: cameraType === 'ip_camera' ? parseInt(formData.port) : undefined,
        username: cameraType === 'ip_camera' ? formData.username : undefined,
        password: cameraType === 'ip_camera' ? formData.password : undefined,
      })
      
      // Reset form and refresh cameras
      setFormData({
        camera_name: "",
        ip_address: "",
        port: "",
        username: "",
        password: ""
      })
      setCameraType("")
      setCameraBrand("")
      await fetchCameras()
    } catch (error) {
      console.error('Error creating camera:', error)
    }
    
    setLoading(false)
  }

  const handleDeleteCamera = async (id: number) => {
    try {
      await api.deleteCamera(id)
      await fetchCameras()
    } catch (error) {
      console.error('Error deleting camera:', error)
    }
  }

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
      {/* Sidebar */}
      <div className="w-64 bg-purple-600 text-white">
        {/* Logo */}
        <div className="p-6 border-b border-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm">AI Facial</div>
              <div className="font-bold text-sm">Recognition</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link href="/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
              <Grid3X3 className="w-5 h-5" />
              <span>Dashboard</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 bg-purple-700 rounded-lg">
            <Camera className="w-5 h-5" />
            <span className="font-medium">Camera Configuration</span>
          </div>
          <Link href="/dashboard/face-upload">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              <span>Face Image Upload</span>
            </div>
          </Link>
          <Link href="/dashboard/notifications">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
              <FileText className="w-5 h-5" />
              <span>Notification & Log</span>
            </div>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-600">Camera Configuration</h1>

            <div className="flex items-center gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    {user?.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="font-medium text-sm">{user?.full_name}</div>
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

        {/* Page Content */}
        <main className="p-8">
          {/* Add New Camera Form */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Camera</h2>
            <Card className="bg-white">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="camera_name" className="text-sm font-medium text-gray-700">
                        Camera Name
                      </Label>
                      <Input 
                        id="camera_name" 
                        placeholder="e.g., Living Room Camera" 
                        className="h-12 rounded-lg border-gray-200" 
                        value={formData.camera_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="camera_brand" className="text-sm font-medium text-gray-700">
                        Camera Brand
                      </Label>
                      <Select value={cameraBrand} onValueChange={setCameraBrand}>
                        <SelectTrigger className="h-12 rounded-lg border-gray-200">
                          <SelectValue placeholder="Select camera brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hikvision">Hikvision</SelectItem>
                          <SelectItem value="Dahua">Dahua</SelectItem>
                          <SelectItem value="TP-Link">TP-Link</SelectItem>
                          <SelectItem value="Axis">Axis</SelectItem>
                          <SelectItem value="Bosch">Bosch</SelectItem>
                          <SelectItem value="Sony">Sony</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="camera_type" className="text-sm font-medium text-gray-700">
                      Camera Type
                    </Label>
                    <Select value={cameraType} onValueChange={setCameraType}>
                      <SelectTrigger className="h-12 rounded-lg border-gray-200">
                        <SelectValue placeholder="Select camera type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ip_camera">IP Camera</SelectItem>
                        <SelectItem value="webcam">Webcam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {cameraType === "ip_camera" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="ip_address" className="text-sm font-medium text-gray-700">
                            IP Address
                          </Label>
                          <Input 
                            id="ip_address" 
                            placeholder="e.g., 192.168.1.100" 
                            className="h-12 rounded-lg border-gray-200" 
                            value={formData.ip_address}
                            onChange={handleInputChange}
                            required={cameraType === "ip_camera"}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="port" className="text-sm font-medium text-gray-700">
                            Port
                          </Label>
                          <Input 
                            id="port" 
                            type="number"
                            placeholder="e.g., 554" 
                            className="h-12 rounded-lg border-gray-200" 
                            value={formData.port}
                            onChange={handleInputChange}
                            required={cameraType === "ip_camera"}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                            Username
                          </Label>
                          <Input 
                            id="username" 
                            placeholder="Enter username" 
                            className="h-12 rounded-lg border-gray-200" 
                            value={formData.username}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            className="h-12 rounded-lg border-gray-200"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-4">
                    {cameraType === "ip_camera" && (
                      <Button type="button" variant="outline" className="px-6 bg-transparent">
                        Test Connection
                      </Button>
                    )}
                    <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 px-8">
                      {loading ? "Adding Camera..." : "Add Camera"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Camera List */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Camera List</h2>
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-purple-600">Camera Name</th>
                        <th className="text-left p-4 font-medium text-purple-600">Brand</th>
                        <th className="text-left p-4 font-medium text-purple-600">Type</th>
                        <th className="text-left p-4 font-medium text-purple-600">Network Details</th>
                        <th className="text-left p-4 font-medium text-purple-600">Status</th>
                        <th className="text-left p-4 font-medium text-purple-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cameras.map((camera, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-4 font-medium text-gray-800">{camera.camera_name}</td>
                          <td className="p-4 text-gray-600">{camera.camera_brand}</td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              {camera.camera_type === 'ip_camera' ? 'IP Camera' : 'Webcam'}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600 text-sm">
                            {camera.camera_type === 'ip_camera' && camera.ip_address ? (
                              <div>
                                <div className="font-mono">{camera.ip_address}:{camera.port}</div>
                                {camera.username && (
                                  <div className="text-xs text-gray-500">{camera.username}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge className={`${getStatusColor(camera.status)} text-white hover:${getStatusColor(camera.status)}`}>
                              {camera.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 p-2">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="p-2"
                                onClick={() => handleDeleteCamera(camera.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
