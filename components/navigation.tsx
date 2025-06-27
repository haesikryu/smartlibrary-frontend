"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Users, TrendingUp, BarChart3, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "홈", href: "/", icon: Home },
  { name: "도서 관리", href: "/books", icon: BookOpen },
  { name: "사용자 관리", href: "/users", icon: Users },
  { name: "대출/반납", href: "/lending", icon: TrendingUp },
  { name: "통계", href: "/statistics", icon: BarChart3 },
  { name: "설정", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">도서관리</span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={cn("flex items-center space-x-2", pathname === item.href && "bg-blue-600 text-white")}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              로그인
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
