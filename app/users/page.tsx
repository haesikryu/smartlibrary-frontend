"use client"

import { useState, useEffect } from "react"
import { Search, Plus, UserCheck, UserX, Mail, Phone, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { apiService, User } from "@/lib/api"

const statusMap = {
  active: { label: "활성", color: "bg-green-100 text-green-800" },
  inactive: { label: "비활성", color: "bg-gray-100 text-gray-800" },
  suspended: { label: "정지", color: "bg-red-100 text-red-800" },
}

const roleMap = {
  ADMIN: { label: "관리자", color: "bg-purple-100 text-purple-800" },
  USER: { label: "일반사용자", color: "bg-gray-100 text-gray-800" },
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('사용자 목록을 가져오는데 실패했습니다:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.active) ||
      (statusFilter === "inactive" && !user.active)

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">사용자 목록을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
          <p className="text-gray-600 mt-2">등록된 사용자를 관리하고 권한을 설정할 수 있습니다.</p>
        </div>
        <Link href="/users/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />새 사용자 등록
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="이름, 이메일, 아이디로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      <AvatarInitials name={user.name} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>@{user.username}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={user.active ? statusMap.active.color : statusMap.inactive.color}>
                    {user.active ? statusMap.active.label : statusMap.inactive.label}
                  </Badge>
                  <Badge className={roleMap[user.role as keyof typeof roleMap].color}>
                    {roleMap[user.role as keyof typeof roleMap].label}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">-</div>
                    <div className="text-xs text-gray-500">대출 중</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">-</div>
                    <div className="text-xs text-gray-500">연체</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                  <span>가입일: {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/users/${user.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                  </Link>
                  {user.active ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await apiService.deactivateUser(user.id);
                        fetchUsers();
                      }}
                    >
                      삭제
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await apiService.activateUser(user.id);
                        fetchUsers();
                      }}
                    >
                      복원
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">사용자가 없습니다</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "검색 조건에 맞는 사용자가 없습니다." 
              : "아직 등록된 사용자가 없습니다."}
          </p>
          <Link href="/users/add">
            <Button>첫 번째 사용자 등록</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
