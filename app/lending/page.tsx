"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Calendar, User, BookOpen, Clock, CheckCircle, AlertCircle, Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { apiService, Lending } from "@/lib/api"

const statusMap = {
  BORROWED: { label: "대출 중", color: "bg-blue-100 text-blue-800", icon: BookOpen },
  RETURNED: { label: "반납 완료", color: "bg-green-100 text-green-800", icon: CheckCircle },
  OVERDUE: { label: "연체", color: "bg-red-100 text-red-800", icon: AlertCircle },
}

export default function LendingPage() {
  const [lendings, setLendings] = useState<Lending[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("lending")

  useEffect(() => {
    fetchLendings()
  }, [])

  const fetchLendings = async () => {
    try {
      const lendingsData = await apiService.getLendings()
      setLendings(lendingsData)
    } catch (error) {
      console.error('대출 목록을 가져오는데 실패했습니다:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLendings = lendings.filter((lending) => {
    const matchesSearch =
      lending.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lending.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lending.bookId.toString().includes(searchTerm.toLowerCase())

    let matchesStatus = true
    if (statusFilter === "borrowed") matchesStatus = lending.status === "BORROWED"
    else if (statusFilter === "overdue") matchesStatus = lending.status === "OVERDUE"
    else if (statusFilter === "returned") matchesStatus = lending.status === "RETURNED"
    else if (statusFilter !== "all") matchesStatus = lending.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleReturn = async (lendingId: number) => {
    try {
      await apiService.returnBook(lendingId)
      fetchLendings() // 목록 새로고침
    } catch (error) {
      console.error('반납 처리에 실패했습니다:', error)
    }
  }

  const handleExtend = async (lendingId: number) => {
    try {
      await apiService.extendLending(lendingId)
      fetchLendings() // 목록 새로고침
    } catch (error) {
      console.error('대출 연장에 실패했습니다:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">대출 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대출/반납 관리</h1>
          <p className="text-gray-600 mt-2">도서 대출 현황과 반납을 관리할 수 있습니다.</p>
        </div>
        <Link href="/lending/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />새 대출 등록
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="lending">대출 현황</TabsTrigger>
        </TabsList>

        <TabsContent value="lending" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="도서명, 사용자명으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="borrowed">대출 중</SelectItem>
                    <SelectItem value="overdue">연체</SelectItem>
                    <SelectItem value="returned">반납 완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lending Records */}
          <div className="space-y-4">
            {filteredLendings.map((lending) => {
              const daysUntilDue = getDaysUntilDue(lending.dueDate)
              const isOverdue = lending.status === "OVERDUE" || daysUntilDue < 0
              const status = isOverdue ? "OVERDUE" : lending.status
              const StatusIcon = statusMap[status as keyof typeof statusMap]?.icon || BookOpen

              return (
                <Card
                  key={lending.id}
                  className={`hover:shadow-md transition-shadow ${isOverdue ? "border-red-200" : ""}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${statusMap[status as keyof typeof statusMap]?.color || "bg-gray-100 text-gray-800"}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{lending.bookTitle}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {lending.userName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              대출: {new Date(lending.borrowedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={statusMap[status as keyof typeof statusMap]?.color || "bg-gray-100 text-gray-800"}>
                            {statusMap[status as keyof typeof statusMap]?.label || lending.status}
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            {lending.status === "RETURNED" ? (
                              <span>반납: {lending.returnedAt ? new Date(lending.returnedAt).toLocaleDateString() : '-'}</span>
                            ) : (
                              <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                                반납예정: {new Date(lending.dueDate).toLocaleDateString()}
                                {!isOverdue && (
                                  <span className="ml-1">
                                    ({daysUntilDue > 0 ? `${daysUntilDue}일 남음` : "오늘 마감"})
                                  </span>
                                )}
                                {isOverdue && (
                                  <span className="ml-1 text-red-600">({Math.abs(daysUntilDue)}일 연체)</span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {lending.status === "BORROWED" && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleExtend(lending.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <RotateCcw className="h-3 w-3" />
                              연장
                            </Button>
                            <Button
                              onClick={() => handleReturn(lending.id)}
                              variant={isOverdue ? "default" : "outline"}
                              size="sm"
                            >
                              반납 처리
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredLendings.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">대출 기록이 없습니다</h3>
                <p className="text-gray-600">검색 조건을 변경하거나 새로운 대출을 등록해보세요.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
