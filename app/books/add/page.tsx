"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api"

export default function AddBookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    category: "",
    totalCopies: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.author || !formData.category) {
      alert("필수 필드를 모두 입력해주세요.")
      return
    }

    try {
      setLoading(true)
      await apiService.createBook({
        ...formData,
        availableCopies: formData.totalCopies,
      })
      alert("도서가 성공적으로 등록되었습니다.")
      router.push("/books")
    } catch (error) {
      console.error('Failed to create book:', error)
      alert("도서 등록에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/books">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">새 도서 등록</h1>
            <p className="text-gray-600 mt-2">새로운 도서 정보를 입력해주세요.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>도서 정보</CardTitle>
            <CardDescription>
              도서의 기본 정보를 입력하세요. * 표시된 필드는 필수 입력 항목입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">도서명 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="도서명을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author">저자 *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder="저자명을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange("isbn", e.target.value)}
                    placeholder="ISBN을 입력하세요"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">도서 설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="도서에 대한 간단한 설명을 입력하세요"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="프로그래밍">프로그래밍</SelectItem>
                      <SelectItem value="데이터베이스">데이터베이스</SelectItem>
                      <SelectItem value="네트워크">네트워크</SelectItem>
                      <SelectItem value="운영체제">운영체제</SelectItem>
                      <SelectItem value="알고리즘">알고리즘</SelectItem>
                      <SelectItem value="웹개발">웹개발</SelectItem>
                      <SelectItem value="모바일개발">모바일개발</SelectItem>
                      <SelectItem value="인공지능">인공지능</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="totalCopies">총 권수 *</Label>
                  <Input
                    id="totalCopies"
                    type="number"
                    min="1"
                    value={formData.totalCopies}
                    onChange={(e) => handleInputChange("totalCopies", parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link href="/books">
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "등록 중..." : "도서 등록"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
