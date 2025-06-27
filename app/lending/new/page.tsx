'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, Calendar } from 'lucide-react';
import { apiService, Book, User } from '@/lib/api';

export default function NewLendingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    fetchBooks();
    fetchUsers();
    // Set default due date to 14 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await apiService.getBooks();
      setBooks(response);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(response);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBookId || !selectedUserId || !dueDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // Convert date to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
      const dueDateTime = `${dueDate}T23:59:59`;
      
      const lendingData = {
        bookId: parseInt(selectedBookId),
        userId: parseInt(selectedUserId),
        dueDate: dueDateTime,
      };

      await apiService.createLending(lendingData);
      router.push('/lending');
    } catch (error) {
      console.error('Failed to create lending:', error);
      alert('대출 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const selectedBook = books.find(book => book.id === parseInt(selectedBookId));
  const selectedUser = users.find(user => user.id === parseInt(selectedUserId));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로가기
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">새 대출 등록</h1>
            <p className="text-gray-600 mt-2">도서 대출 정보를 입력해주세요.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>대출 정보</CardTitle>
            <CardDescription>
              대출할 도서와 사용자를 선택하고 반납 예정일을 설정하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Selection */}
              <div className="space-y-2">
                <Label htmlFor="book">도서 선택 *</Label>
                <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                  <SelectTrigger>
                    <SelectValue placeholder="대출할 도서를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {books
                      .filter(book => book.availableCopies > 0)
                      .map((book) => (
                        <SelectItem key={book.id} value={book.id.toString()}>
                          {book.title} - {book.author} (대여가능: {book.availableCopies}권)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedBook && (
                  <div className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-md">
                    <p><strong>제목:</strong> {selectedBook.title}</p>
                    <p><strong>저자:</strong> {selectedBook.author}</p>
                    <p><strong>카테고리:</strong> {selectedBook.category}</p>
                    <p><strong>대여가능:</strong> {selectedBook.availableCopies}권</p>
                  </div>
                )}
              </div>

              {/* User Selection */}
              <div className="space-y-2">
                <Label htmlFor="user">사용자 선택 *</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="대출할 사용자를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(user => user.active)
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedUser && (
                  <div className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-md">
                    <p><strong>이름:</strong> {selectedUser.name}</p>
                    <p><strong>이메일:</strong> {selectedUser.email}</p>
                    <p><strong>전화번호:</strong> {selectedUser.phone}</p>
                    <p><strong>역할:</strong> {selectedUser.role}</p>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate">반납 예정일 *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  기본 반납 기간은 14일로 설정되어 있습니다.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !selectedBookId || !selectedUserId || !dueDate}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  대출 등록
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 