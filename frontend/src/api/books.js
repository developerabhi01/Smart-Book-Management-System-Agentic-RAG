import api from "./axios";

// Mock data for development
const mockBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", year_published: 1925 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", year_published: 1960 },
  { id: 3, title: "1984", author: "George Orwell", genre: "Dystopian", year_published: 1949 }
];

let nextId = 4;

const handleApiError = async (apiCall, mockResponse) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ECONNREFUSED' || error.response?.status === 500) {
      console.warn('Backend not available, using mock data');
      return { data: mockResponse };
    }
    throw error;
  }
};

export const getBooks = () => handleApiError(
  () => api.get("/books"),
  mockBooks
);

export const getBookById = (id) => handleApiError(
  () => api.get(`/books/${id}`),
  mockBooks.find(book => book.id === parseInt(id))
);

export const addBook = (data) => handleApiError(
  () => api.post("/books", data),
  (() => {
    const newBook = { ...data, id: nextId++ };
    mockBooks.push(newBook);
    return newBook;
  })()
);

export const updateBook = (id, data) => handleApiError(
  () => api.put(`/books/${id}`, data),
  (() => {
    const index = mockBooks.findIndex(book => book.id === parseInt(id));
    if (index !== -1) {
      mockBooks[index] = { ...mockBooks[index], ...data };
      return mockBooks[index];
    }
    return null;
  })()
);

export const deleteBook = (id) => handleApiError(
  () => api.delete(`/books/${id}`),
  (() => {
    const index = mockBooks.findIndex(book => book.id === parseInt(id));
    if (index !== -1) {
      mockBooks.splice(index, 1);
      return { message: 'Book deleted successfully' };
    }
    return null;
  })()
);

export const generateSummary = (id) => handleApiError(
  () => api.post(`/books/${id}/generate-summary`),
  { message: 'Summary generated successfully' }
);

export const getBookSummary = (id) => handleApiError(
  () => api.get(`/books/${id}/summary`),
  { summary: 'This is a mock summary for the book.' }
);