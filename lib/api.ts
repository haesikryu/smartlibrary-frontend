const API_BASE_URL = 'http://localhost:8080/api';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lending {
  id: number;
  userId: number;
  userName: string;
  bookId: number;
  bookTitle: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookStats {
  totalBooks: number;
  availableBooks: number;
  activeLendings: number;
  overdueLendings: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Book APIs
  async getBooks(): Promise<Book[]> {
    return this.request<Book[]>('/books');
  }

  async getBook(id: number): Promise<Book> {
    return this.request<Book>(`/books/${id}`);
  }

  async searchBooksByTitle(title: string): Promise<Book[]> {
    return this.request<Book[]>(`/books/search/title?title=${encodeURIComponent(title)}`);
  }

  async searchBooksByAuthor(author: string): Promise<Book[]> {
    return this.request<Book[]>(`/books/search/author?author=${encodeURIComponent(author)}`);
  }

  async getBooksByCategory(category: string): Promise<Book[]> {
    return this.request<Book[]>(`/books/category/${encodeURIComponent(category)}`);
  }

  async getAvailableBooks(): Promise<Book[]> {
    return this.request<Book[]>('/books/available');
  }

  async createBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    return this.request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: number, book: Partial<Book>): Promise<Book> {
    return this.request<Book>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    });
  }

  async deleteBook(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    if (res.status !== 204 && res.status !== 200) {
      throw new Error('삭제 실패');
    }
    // 204 No Content는 body가 없으므로 아무것도 하지 않음
  }

  async getBookStats(): Promise<BookStats> {
    const [totalBooks, availableBooks] = await Promise.all([
      this.request<number>('/books/stats/total'),
      this.request<number>('/books/stats/available'),
    ]);

    return {
      totalBooks,
      availableBooks,
      activeLendings: 0, // TODO: Implement lending stats
      overdueLendings: 0, // TODO: Implement lending stats
    };
  }

  async getBookById(id: number): Promise<Book> {
    return this.request<Book>(`/books/${id}`);
  }

  // User APIs
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (res.status !== 204 && res.status !== 200) {
      throw new Error('사용자 삭제 실패');
    }
  }

  async deactivateUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}/deactivate`, {
      method: 'PUT',
    });
  }

  async activateUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}/activate`, {
      method: 'PUT',
    });
  }

  // Lending APIs
  async getLendings(): Promise<Lending[]> {
    return this.request<Lending[]>('/lendings');
  }

  async getLending(id: number): Promise<Lending> {
    return this.request<Lending>(`/lendings/${id}`);
  }

  async createLending(lending: { bookId: number; userId: number; dueDate: string }): Promise<Lending> {
    return this.request<Lending>('/lendings', {
      method: 'POST',
      body: JSON.stringify(lending),
    });
  }

  async updateLending(id: number, lending: Partial<Lending>): Promise<Lending> {
    return this.request<Lending>(`/lendings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lending),
    });
  }

  async deleteLending(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/lendings/${id}`, {
      method: 'DELETE',
    });
    if (res.status !== 204 && res.status !== 200) {
      throw new Error('대출 기록 삭제 실패');
    }
  }

  async returnBook(lendingId: number): Promise<Lending> {
    return this.request<Lending>(`/lendings/${lendingId}/return`, {
      method: 'PUT',
    });
  }

  async extendLending(lendingId: number): Promise<Lending> {
    return this.request<Lending>(`/lendings/${lendingId}/extend`, {
      method: 'PUT',
    });
  }

  // Statistics APIs
  async getOverviewStats(): Promise<any> {
    return this.request<any>('/statistics/overview');
  }

  async getMonthlyStats(): Promise<any> {
    return this.request<any>('/statistics/monthly');
  }

  async getPopularBooks(): Promise<any> {
    return this.request<any>('/statistics/popular-books');
  }

  async getCategoryStats(): Promise<any> {
    return this.request<any>('/statistics/category-stats');
  }

  async getDepartmentStats(): Promise<any> {
    return this.request<any>('/statistics/department-stats');
  }

  async getGrowthStats(): Promise<any> {
    return this.request<any>('/statistics/growth-stats');
  }
}

export const apiService = new ApiService();

// Standalone function exports for convenience
export const getBook = (id: number) => apiService.getBook(id);
export const updateBook = (id: number, book: Partial<Book>) => apiService.updateBook(id, book);
export const getBooks = () => apiService.getBooks();
export const createBook = (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => apiService.createBook(book);
export const deleteBook = (id: number) => apiService.deleteBook(id);
export const getUsers = () => apiService.getUsers();
export const getUser = (id: number) => apiService.getUser(id);
export const createUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => apiService.createUser(user);
export const updateUser = (id: number, user: Partial<User>) => apiService.updateUser(id, user);
export const deactivateUser = (id: number) => apiService.deactivateUser(id);
export const activateUser = (id: number) => apiService.activateUser(id);
export const getLendings = () => apiService.getLendings();
export const createLending = (lending: { bookId: number; userId: number; dueDate: string }) => apiService.createLending(lending);
export const returnBook = (lendingId: number) => apiService.returnBook(lendingId);
export const extendLending = (lendingId: number) => apiService.extendLending(lendingId);
export const getOverviewStats = () => apiService.getOverviewStats();
export const getMonthlyStats = () => apiService.getMonthlyStats();
export const getPopularBooks = () => apiService.getPopularBooks();
export const getCategoryStats = () => apiService.getCategoryStats();
export const getDepartmentStats = () => apiService.getDepartmentStats();
export const getGrowthStats = () => apiService.getGrowthStats(); 