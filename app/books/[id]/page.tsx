"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, BookOpen, Calendar, User, Hash } from "lucide-react"
import Link from "next/link"
import { apiService, Book } from "@/lib/api"

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBook()
  }, [params.id])

  const fetchBook = async () => {
    try {
      setLoading(true)
      const data = await apiService.getBook(parseInt(params.id))
      setBook(data)
    } catch (error) {
      console.error('Failed to fetch book:', error)
      setError('도서 정보를 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!book) return
    
    if (!confirm('정말로 이 도서를 삭제하시겠습니까?')) {
      return
    }

    try {
      await apiService.deleteBook(book.id)
      alert('도서가 삭제되었습니다.')
      router.push('/books')
    } catch (error) {
      console.error('Failed to delete book:', error)
      alert('도서 삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">도서 정보를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">{error || '도서를 찾을 수 없습니다.'}</p>
              <Button onClick={() => router.back()} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                뒤로 가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
            <p className="text-gray-600 mt-2">도서 상세 정보</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/books/edit/${book.id}`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                수정
              </Button>
            </Link>
            <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">제목</label>
                    <p className="text-lg font-semibold">{book.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">저자</label>
                    <p className="text-lg">{book.author}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ISBN</label>
                    <p className="text-lg">{book.isbn || '등록되지 않음'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">카테고리</label>
                    <div className="mt-1">
                      <Badge variant="secondary">{book.category}</Badge>
                    </div>
                  </div>
                </div>
                
                {book.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">설명</label>
                    <p className="text-gray-700 mt-1 leading-relaxed">{book.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  대출 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{book.totalCopies}</div>
                    <div className="text-sm text-gray-600">총 보유 권수</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{book.availableCopies}</div>
                    <div className="text-sm text-gray-600">대출 가능 권수</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{book.totalCopies - book.availableCopies}</div>
                    <div className="text-sm text-gray-600">대출 중인 권수</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>대출률</span>
                    <span>{Math.round(((book.totalCopies - book.availableCopies) / book.totalCopies) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${((book.totalCopies - book.availableCopies) / book.totalCopies) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/lending/new?bookId=${book.id}`}>
                  <Button className="w-full" disabled={book.availableCopies === 0}>
                    대출하기
                  </Button>
                </Link>
                <Link href={`/books/edit/${book.id}`}>
                  <Button variant="outline" className="w-full">
                    정보 수정
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  메타데이터
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">등록일</label>
                  <p className="text-sm">{new Date(book.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">최종 수정일</label>
                  <p className="text-sm">{new Date(book.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 