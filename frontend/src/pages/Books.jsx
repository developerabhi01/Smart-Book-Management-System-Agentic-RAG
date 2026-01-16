import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/books";
import DataTable from 'react-data-table-component';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (error) {
      console.error('Failed to load books:', error);
      alert('Failed to load books. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        console.log('Deleting book with ID:', id);
        await deleteBook(id);
        console.log('Delete successful, reloading books');
        await loadBooks();
        alert('Book deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        if (error.response?.status === 401) {
          alert('Authentication failed. Please login again.');
        } else if (error.response?.status === 404) {
          alert('Book not found.');
        } else {
          alert(`Failed to delete book: ${error.response?.data?.message || error.message}`);
        }
      }
    }
  };

  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Author',
      selector: row => row.author,
      sortable: true,
    },
    {
      name: 'Genre',
      selector: row => row.genre,
      sortable: true,
    },
    {
      name: 'Year',
      selector: row => row.year_published,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Actions',
      cell: row => (
        <button 
          className="btn btn-danger"
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </button>
      ),
      width: '120px',
    },
  ];

  return (
    <div className="container">
      <div className="card">
        <h2>Books</h2>
        <DataTable
          columns={columns}
          data={books}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          progressPending={loading}
          highlightOnHover
          striped
          responsive
          noDataComponent="No books found"
        />
      </div>
    </div>
  );
}
