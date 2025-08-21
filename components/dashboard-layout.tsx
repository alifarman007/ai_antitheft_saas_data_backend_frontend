"use client"

import type React from "react"

import { Bell, Camera, Upload, FileText, Grid3X3 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Grid3X3,
    },
    {
      name: "Camera Configuration",
      href: "/dashboard/camera-configuration",
      icon: Camera,
    },
    {
      name: "Face Image Upload",
      href: "/dashboard/face-upload",
      icon: Upload,
    },
    {
      name: "Notification & Log",
      href: "/dashboard/notifications",
      icon: FileText,
    },
  ]

  return (
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
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors",
                  pathname === item.href ? "bg-purple-700" : "hover:bg-purple-700",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className={pathname === item.href ? "font-medium" : ""}>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-600">{title}</h1>

            <div className="flex items-center gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="font-medium text-sm">Arafat Hossain Adi</div>
                  <div className="text-xs text-gray-500">arafat.adi@sysnova.com</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
