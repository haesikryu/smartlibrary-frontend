"use client"

import { BookOpen, Users, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { apiService, BookStats, User } from "@/lib/api"

export default function HomePage() {
  const [stats, setStats] = useState<BookStats>({
    totalBooks: 0,
    availableBooks: 0,
    activeLendings: 0,
    overdueLendings: 0,
  })
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookStats = await apiService.getBookStats()
        setStats(bookStats)
        const users = await apiService.getUsers();
        setUserCount(users.length);
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">도서 관리 시스템</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            효율적인 도서 관리를 위한 통합 솔루션으로 도서 등록부터 대출, 반납까지 모든 과정을 디지털화합니다.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 도서</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "로딩 중..." : stats.totalBooks}
              </div>
              <p className="text-xs text-muted-foreground">+20 이번 달</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">등록 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "로딩 중..." : userCount}</div>
              <p className="text-xs text-muted-foreground">+5 이번 주</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">대출 중</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "로딩 중..." : stats.activeLendings}
              </div>
              <p className="text-xs text-muted-foreground">+12% 전월 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">연체 도서</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "로딩 중..." : stats.overdueLendings}
              </div>
              <p className="text-xs text-muted-foreground">-3 지난 주 대비</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                도서 관리
              </CardTitle>
              <CardDescription>도서 등록, 검색, 수정 및 삭제 기능을 제공합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/books">
                  <Button className="w-full" variant="outline">
                    도서 목록 보기
                  </Button>
                </Link>
                <Link href="/books/add">
                  <Button className="w-full">새 도서 등록</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                사용자 관리
              </CardTitle>
              <CardDescription>사용자 등록, 권한 관리 및 대출 이력을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/users">
                  <Button className="w-full" variant="outline">
                    사용자 목록
                  </Button>
                </Link>
                <Link href="/users/add">
                  <Button className="w-full">새 사용자 등록</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                대출/반납 관리
              </CardTitle>
              <CardDescription>도서 대출, 반납 처리 및 예약 관리를 수행합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/lending">
                  <Button className="w-full" variant="outline">
                    대출 현황
                  </Button>
                </Link>
                <Link href="/lending/new">
                  <Button className="w-full">새 대출 등록</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>시스템의 최근 활동 내역입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">{"클린 코드"} 도서가 반납되었습니다.</p>
                  <p className="text-sm text-muted-foreground">김철수 • 2분 전</p>
                </div>
                <div className="text-green-600 font-medium">반납 완료</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{"리팩터링"} 도서가 대출되었습니다.</p>
                  <p className="text-sm text-muted-foreground">이영희 • 15분 전</p>
                </div>
                <div className="text-blue-600 font-medium">대출 완료</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium">새로운 사용자가 등록되었습니다.</p>
                  <p className="text-sm text-muted-foreground">박민수 • 1시간 전</p>
                </div>
                <div className="text-orange-600 font-medium">사용자 등록</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
