'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { apiService, Book } from '@/lib/api';

export default function EditBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await apiService.getBook(parseInt(params.id));
        setBook(bookData);
      } catch (err) {
        setError('책 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    setSaving(true);
    setError(null);

    try {
      await apiService.updateBook(book.id, book);
      router.push(`/books/${book.id}`);
    } catch (err) {
      setError('책 정보를 수정하는데 실패했습니다.');
      console.error('Error updating book:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Book, value: string | number) => {
    if (!book) return;
    setBook({ ...book, [field]: value });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">책 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">{error || '책을 찾을 수 없습니다.'}</p>
              <Button onClick={() => router.back()} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                뒤로 가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>책 정보 수정</CardTitle>
          <CardDescription>
            책의 정보를 수정하고 저장하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={book.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">저자 *</Label>
                <Input
                  id="author"
                  value={book.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={book.isbn || ''}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  placeholder="978-0-000000-0-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={book.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="소설">소설</SelectItem>
                    <SelectItem value="자기계발">자기계발</SelectItem>
                    <SelectItem value="경제/경영">경제/경영</SelectItem>
                    <SelectItem value="역사">역사</SelectItem>
                    <SelectItem value="과학">과학</SelectItem>
                    <SelectItem value="기술">기술</SelectItem>
                    <SelectItem value="예술">예술</SelectItem>
                    <SelectItem value="여행">여행</SelectItem>
                    <SelectItem value="요리">요리</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalCopies">총 복본 수 *</Label>
                <Input
                  id="totalCopies"
                  type="number"
                  min="1"
                  value={book.totalCopies}
                  onChange={(e) => handleInputChange('totalCopies', parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableCopies">대여 가능한 복본 수 *</Label>
                <Input
                  id="availableCopies"
                  type="number"
                  min="0"
                  max={book.totalCopies}
                  value={book.availableCopies}
                  onChange={(e) => handleInputChange('availableCopies', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={book.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="책에 대한 설명을 입력하세요..."
                rows={4}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                취소
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 