"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { apiService, Book } from "@/lib/api"

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"title" | "author">("title")

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await apiService.getBooks()
      setBooks(data)
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBooks()
      return
    }

    try {
      setLoading(true)
      let data: Book[]
      if (searchType === "title") {
        data = await apiService.searchBooksByTitle(searchTerm)
      } else {
        data = await apiService.searchBooksByAuthor(searchTerm)
      }
      setBooks(data)
    } catch (error) {
      console.error('Failed to search books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 도서를 삭제하시겠습니까?')) {
      return
    }

    try {
      await apiService.deleteBook(id)
      setBooks(books.filter(book => book.id !== id))
    } catch (error) {
      console.error('Failed to delete book:', error)
      alert('도서 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">도서 관리</h1>
          <p className="text-gray-600 mt-2">도서 목록을 확인하고 관리할 수 있습니다.</p>
        </div>
        <Link href="/books/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            새 도서 등록
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="도서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "title" | "author")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">제목</option>
              <option value="author">저자</option>
            </select>
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">도서 목록을 불러오는 중...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">도서가 없습니다</h3>
          <p className="text-gray-600 mb-4">새로운 도서를 등록해보세요.</p>
          <Link href="/books/add">
            <Button>첫 도서 등록하기</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{book.title}</CardTitle>
                    <CardDescription className="text-sm">
                      저자: {book.author}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/books/edit/${book.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ISBN: {book.isbn}</p>
                    <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{book.category}</Badge>
                    <div className="text-sm text-gray-600">
                      대출 가능: {book.availableCopies}/{book.totalCopies}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      등록일: {new Date(book.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/books/${book.id}`}>
                      <Button variant="outline" size="sm">
                        상세보기
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
