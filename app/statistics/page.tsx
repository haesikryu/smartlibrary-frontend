"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, BookOpen, Clock, Star, Loader2, TrendingDown, Plus, Minus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { apiService } from "@/lib/api"

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true)
  const [overviewStats, setOverviewStats] = useState<any>(null)
  const [monthlyStats, setMonthlyStats] = useState<any[]>([])
  const [popularBooks, setPopularBooks] = useState<any[]>([])
  const [categoryStats, setCategoryStats] = useState<any[]>([])
  const [departmentStats, setDepartmentStats] = useState<any[]>([])
  const [growthStats, setGrowthStats] = useState<any>(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const [
        overview,
        monthly,
        popular,
        category,
        department,
        growth
      ] = await Promise.all([
        apiService.getOverviewStats(),
        apiService.getMonthlyStats(),
        apiService.getPopularBooks(),
        apiService.getCategoryStats(),
        apiService.getDepartmentStats(),
        apiService.getGrowthStats()
      ])

      setOverviewStats(overview)
      setMonthlyStats(monthly.monthlyStats || [])
      setPopularBooks(popular.popularBooks || [])
      setCategoryStats(category.categoryStats || [])
      setDepartmentStats(department.departmentStats || [])
      setGrowthStats(growth)
    } catch (error) {
      console.error('통계 데이터를 가져오는데 실패했습니다:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (rate < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return "text-green-600"
    if (rate < 0) return "text-red-600"
    return "text-gray-600"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">통계 데이터를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">통계 및 리포트</h1>
        <p className="text-gray-600 mt-2">도서관 이용 현황과 통계를 확인할 수 있습니다.</p>
      </div>

      {/* Growth Statistics */}
      {growthStats && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">현황 및 증가율</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 도서 현황 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">도서 현황</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">총 도서 수</span>
                    <span className="font-bold">{growthStats.bookStats?.totalBooks || 0}권</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">이용 가능</span>
                    <span className="font-bold">{growthStats.bookStats?.availableBooks || 0}권</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">이용률</span>
                    <span className="font-bold">{growthStats.bookStats?.utilizationRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">이번 달 신규</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{growthStats.bookStats?.newBooksThisMonth || 0}권</span>
                      {getGrowthIcon(growthStats.bookStats?.bookGrowthRate || 0)}
                      <span className={`text-xs ${getGrowthColor(growthStats.bookStats?.bookGrowthRate || 0)}`}>
                        {growthStats.bookStats?.bookGrowthRate || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 사용자 현황 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">사용자 현황</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">총 사용자</span>
                    <span className="font-bold">{growthStats.userStats?.totalUsers || 0}명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">활성 사용자</span>
                    <span className="font-bold">{growthStats.userStats?.activeUsers || 0}명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">활성화율</span>
                    <span className="font-bold">{growthStats.userStats?.activationRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">이번 달 신규</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{growthStats.userStats?.newUsersThisMonth || 0}명</span>
                      {getGrowthIcon(growthStats.userStats?.userGrowthRate || 0)}
                      <span className={`text-xs ${getGrowthColor(growthStats.userStats?.userGrowthRate || 0)}`}>
                        {growthStats.userStats?.userGrowthRate || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 대출 현황 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">대출 현황</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">이번 달 대출</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{growthStats.lendingStats?.currentMonthBorrowed || 0}건</span>
                      {getGrowthIcon(growthStats.lendingStats?.borrowGrowthRate || 0)}
                      <span className={`text-xs ${getGrowthColor(growthStats.lendingStats?.borrowGrowthRate || 0)}`}>
                        {growthStats.lendingStats?.borrowGrowthRate || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">지난 달 대출</span>
                    <span className="font-bold">{growthStats.lendingStats?.previousMonthBorrowed || 0}건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">이번 달 반납</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{growthStats.lendingStats?.currentMonthReturned || 0}건</span>
                      {getGrowthIcon(growthStats.lendingStats?.returnGrowthRate || 0)}
                      <span className={`text-xs ${getGrowthColor(growthStats.lendingStats?.returnGrowthRate || 0)}`}>
                        {growthStats.lendingStats?.returnGrowthRate || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">지난 달 반납</span>
                    <span className="font-bold">{growthStats.lendingStats?.previousMonthReturned || 0}건</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 대출</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats?.thisMonthBorrowed || 0}</div>
            <p className="text-xs text-muted-foreground">
              이번 달 대출 건수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              최근 30일 내 대출한 사용자
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 대출 기간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats?.avgBorrowDays || 0}일</div>
            <p className="text-xs text-muted-foreground">
              반납된 도서 기준
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">연체율</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats?.overdueRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              현재 대출 중인 도서 기준
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              월별 대출/반납 현황
            </CardTitle>
            <CardDescription>최근 6개월간의 대출 및 반납 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stat.month}</span>
                    <span>
                      대출: {stat.borrowed} / 반납: {stat.returned}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Progress value={stat.borrowed > 0 ? (stat.borrowed / Math.max(...monthlyStats.map(s => s.borrowed))) * 100 : 0} className="h-2" />
                    </div>
                    <div className="flex-1">
                      <Progress value={stat.returned > 0 ? (stat.returned / Math.max(...monthlyStats.map(s => s.returned))) * 100 : 0} className="h-2 bg-green-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              인기 도서 TOP 5
            </CardTitle>
            <CardDescription>가장 많이 대출된 도서</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-gray-600">{book.author}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{book.borrowCount}</div>
                    <div className="text-xs text-gray-500">회 대출</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 이용 현황</CardTitle>
            <CardDescription>카테고리별 보유 도서 및 대출 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm text-gray-600">
                      {category.borrowed}/{category.total} ({category.percentage}%)
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>부서별 이용 현황</CardTitle>
            <CardDescription>부서별 사용자 수 및 대출 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{dept.department}</div>
                    <div className="text-sm text-gray-600">{dept.users}명 등록</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{dept.borrowed}</div>
                    <div className="text-xs text-gray-500">총 대출</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
