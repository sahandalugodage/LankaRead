import React, { useEffect, useState } from "react";
import { MdAdd, MdMenuBook, MdSearch, MdSync } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Book } from "../types/Book";
import BookTable from "../components/tables/BookTable";
import BookForm from "../components/forms/BookForm";
import axios from "axios";
import toast from "react-hot-toast";
import { addBook, deleteBook, getAllBooks, updateBook } from "../services/bookService";
import { useSocket } from "../hooks/useSocket";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isBooksLoading, setIsBooksLoading] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchAllBooks = async () => {
    try {
      setIsBooksLoading(true);
      const result = await getAllBooks();
      setBooks(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load catalog");
      }
    } finally {
      setIsBooksLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  useSocket(fetchAllBooks);

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsAddDialogOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (bookData: Omit<Book, "_id">) => {
    if (selectedBook) {
      try {
        const updatedBook = await updateBook(selectedBook._id!, bookData);
        setBooks((prev) =>
          prev.map((book) => (book._id === selectedBook._id ? updatedBook : book))
        );
        toast.success("Catalog item updated");
        setIsEditDialogOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Failed to update book");
        }
      }
    } else {
      try {
        const newBook = await addBook(bookData);
        setBooks((prev) => [...prev, newBook]);
        toast.success("New book cataloged");
        setIsAddDialogOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Failed to add book");
        }
      }
    }
    setSelectedBook(null);
  };

  const confirmDelete = async () => {
    if (selectedBook) {
      try {
        await deleteBook(selectedBook._id!);
        toast.success("Book removed from catalog");
        fetchAllBooks();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Failed to delete book");
        }
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedBook(null);
      }
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedBook(null);
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MdMenuBook className="w-4 h-4" />
            <span>LankaRead Catalog</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Book Repository</h1>
          <p className="text-xs text-slate-400 mt-1">Manage titles, authors, genres, and available copies</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAllBooks}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh Catalog"
          >
            <MdSync className={`w-5 h-5 ${isBooksLoading ? "animate-spin text-teal-400" : ""}`} />
          </button>
          <button
            onClick={handleAddBook}
            className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-teal-500/20"
          >
            <MdAdd className="w-5 h-5" />
            <span>Catalog New Book</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
        <MdSearch className="w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search catalog by title, author, or genre..."
          className="bg-transparent border-none text-slate-200 text-sm focus:outline-none w-full placeholder-slate-500"
        />
      </div>

      {isBooksLoading && (
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
          Syncing LankaRead book catalog...
        </div>
      )}

      {!isBooksLoading && (
        <BookTable books={filteredBooks} onEdit={handleEditBook} onDelete={handleDeleteBook} />
      )}

      <Dialog
        isOpen={isAddDialogOpen}
        onCancel={cancelDialog}
        onConfirm={() => {
          const form = document.querySelector("form") as HTMLFormElement;
          if (form) form.requestSubmit();
        }}
        title="Catalog New Book Title"
      >
        <BookForm onSubmit={handleFormSubmit} />
      </Dialog>

      <Dialog
        isOpen={isEditDialogOpen}
        onCancel={cancelDialog}
        onConfirm={() => {
          const form = document.querySelector("form") as HTMLFormElement;
          if (form) form.requestSubmit();
        }}
        title="Update Catalog Information"
      >
        <BookForm book={selectedBook} onSubmit={handleFormSubmit} />
      </Dialog>

      <Dialog isOpen={isDeleteDialogOpen} onCancel={cancelDialog} onConfirm={confirmDelete} title="Remove From Catalog">
        <p className="text-slate-300 text-sm leading-relaxed">
          Are you sure you want to remove <strong className="text-white">{selectedBook?.title}</strong> from circulation? This operation cannot be reversed.
        </p>
      </Dialog>
    </div>
  );
};

export default BooksPage;