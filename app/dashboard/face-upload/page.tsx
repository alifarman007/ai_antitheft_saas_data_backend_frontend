"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Edit, Trash2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { api, RegisteredFace } from "@/lib/api"

export default function FaceUploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [faces, setFaces] = useState<RegisteredFace[]>([])
  const [faceName, setFaceName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFaces()
  }, [])

  const fetchFaces = async () => {
    try {
      const data = await api.getFaces()
      setFaces(data)
    } catch (error) {
      console.error('Error fetching faces:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !faceName.trim()) return
    
    setLoading(true)
    try {
      await api.createFace(faceName, selectedFile)
      setFaceName("")
      setSelectedFile(null)
      await fetchFaces()
    } catch (error) {
      console.error('Error creating face:', error)
    }
    setLoading(false)
  }

  const handleDeleteFace = async (id: number) => {
    try {
      await api.deleteFace(id)
      await fetchFaces()
    } catch (error) {
      console.error('Error deleting face:', error)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setSelectedFile(files[0])
    }
  }

  return (
    <ProtectedRoute>
    <DashboardLayout title="Face Image Upload">
      {/* Upload New Face */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Upload New Face</h2>
        <Card className="bg-white">
          <CardContent className="p-6">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition-colors ${
                dragActive ? "border-purple-400 bg-purple-50" : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {selectedFile ? selectedFile.name : "Drag & Drop"}
                  </h3>
                  <p className="text-gray-500 mb-4">OR</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" className="bg-purple-600 hover:bg-purple-700" asChild>
                      <span>Select File</span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Face Name Input */}
            <form onSubmit={handleSubmit}>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="faceName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Face Name
                  </Label>
                  <Input 
                    id="faceName" 
                    placeholder="Enter Name of the Face" 
                    className="h-12 rounded-lg border-gray-200"
                    value={faceName}
                    onChange={(e) => setFaceName(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !selectedFile || !faceName.trim()}
                  className="bg-purple-600 hover:bg-purple-700 h-12 px-8"
                >
                  {loading ? "Uploading..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Face List */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Face List</h2>
        <Card className="bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-purple-600">Image</th>
                    <th className="text-left p-4 font-medium text-purple-600">Name</th>
                    <th className="text-left p-4 font-medium text-purple-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faces.map((face) => (
                    <tr key={face.id} className="border-b border-gray-100">
                      <td className="p-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={face.face_image_path || "/placeholder.svg"} />
                          <AvatarFallback>{face.face_name[0]}</AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="p-4 font-medium text-gray-800">{face.face_name}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 p-2">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="p-2"
                            onClick={() => handleDeleteFace(face.id)}
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
    </DashboardLayout>
    </ProtectedRoute>
  )
}
