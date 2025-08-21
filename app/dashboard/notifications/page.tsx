"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { UserCircle, Camera } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { api, DetectionLog } from "@/lib/api"

export default function NotificationsPage() {
  const [detectionLogs, setDetectionLogs] = useState<DetectionLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDetectionLogs()
  }, [])

  const fetchDetectionLogs = async () => {
    try {
      const data = await api.getDetectionLogs()
      setDetectionLogs(data)
    } catch (error) {
      console.error('Error fetching detection logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout title="Notification & Log">
        {/* Detection Log */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Person Detection Log</h2>
          <Card className="bg-white">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading detection logs...</p>
                </div>
              ) : detectionLogs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No detection logs found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-purple-600 w-16"></th>
                        <th className="text-left p-4 font-medium text-purple-600">Face Name</th>
                        <th className="text-left p-4 font-medium text-purple-600">Camera</th>
                        <th className="text-left p-4 font-medium text-purple-600">Confidence</th>
                        <th className="text-left p-4 font-medium text-purple-600">Date</th>
                        <th className="text-left p-4 font-medium text-purple-600">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detectionLogs.map((log) => (
                        <tr key={log.id} className="border-b border-gray-100">
                          <td className="p-4">
                            <UserCircle className="w-8 h-8 text-purple-600" />
                          </td>
                          <td className="p-4 font-medium text-gray-800">
                            {log.registered_face?.face_name || 'Unknown'}
                          </td>
                          <td className="p-4 text-gray-600 flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            {log.camera?.camera_name || 'Unknown Camera'}
                          </td>
                          <td className="p-4 text-gray-600">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              log.detection_confidence >= 0.8 
                                ? 'bg-green-100 text-green-800' 
                                : log.detection_confidence >= 0.6 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {Math.round(log.detection_confidence * 100)}%
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{formatDate(log.detected_at)}</td>
                          <td className="p-4 text-gray-600 font-mono">{formatTime(log.detected_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
