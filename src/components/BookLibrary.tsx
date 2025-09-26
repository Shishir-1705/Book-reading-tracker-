import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, BookOpen, Filter, BookOpenText, Calendar, Hash, Book, User } from "lucide-react";
import BookCard from "./BookCard";
import AddBookForm from "./AddBookForm";
import EditBookForm from "./EditBookForm";
import ProgressEditForm from "./ProgressEditForm";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  total_pages?: number;
  genre?: string;
}

interface Progress {
  book_id: string;
  current_page: number | null;
  completed_date?: string;
  status: 'not_started' | 'reading' | 'completed' | 'on_hold' | 'abandoned';
  rating?: number;
  notes?: string;
}

interface BookDetailsProps {
  book: Book;
  progress?: Progress;
  onClose: () => void;
}

const BookDetailsModal = ({ book, progress, onClose }: BookDetailsProps) => {
  const deriveStatus = () => {
    return progress?.status || 'not_started';
  };

  const status = deriveStatus();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpenText className="w-6 h-6" />
            {book.title}
          </DialogTitle>
          <DialogDescription>Book details and reading progress</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Cover Image */}
          {book.cover_url && (
            <div className="text-center">
              <img
                src={book.cover_url}
                alt={`${book.title} cover`}
                className="w-48 h-72 object-cover rounded-lg mx-auto shadow-md"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">Title:</span>
              </div>
              <p className="text-lg">{book.title}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">Author:</span>
              </div>
              <p className="text-lg">{book.author}</p>
            </div>

            {book.genre && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Genre:</span>
                </div>
                <Badge variant="secondary">{book.genre}</Badge>
              </div>
            )}



            {book.total_pages && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Pages:</span>
                </div>
                <p>{book.total_pages}</p>
              </div>
            )}
          </div>



          {/* Reading Progress */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Reading Progress
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={status === 'completed' ? 'default' : status === 'reading' ? 'secondary' : 'outline'}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Current Page:</span>
                <span>{progress?.current_page || 0}</span>
              </div>
              {book.total_pages && (
                <div className="flex justify-between">
                  <span>Progress:</span>
                  <span>{Math.round((progress?.current_page || 0) / book.total_pages * 100)}%</span>
                </div>
              )}
              {progress?.completed_date && (
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span>{new Date(progress.completed_date).toLocaleDateString()}</span>
                </div>
              )}
              {progress?.rating && (
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span>{progress.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BookLibrary = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showProgressEdit, setShowProgressEdit] = useState(false);
  const [editingProgressBookId, setEditingProgressBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (!token || !storedUser) {
        throw new Error('Not authenticated');
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      const booksResponse = await fetch(`http://localhost:5000/api/books/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!booksResponse.ok) throw new Error('Failed to fetch books');
      const booksData = await booksResponse.json();

      const progressResponse = await fetch(`http://localhost:5000/api/reading-progress/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!progressResponse.ok) throw new Error('Failed to fetch progress');
      const progressData = await progressResponse.json();

      // Map _id to id for consistency
      const mappedBooks = booksData.map((book: any) => ({
        ...book,
        id: book._id
      }));

      setBooks(mappedBooks);
      setProgress(progressData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookAdded = () => {
    setShowAddForm(false);
    fetchBooks();
  };

  const handleBookUpdated = () => {
    setShowEditForm(false);
    setEditingBook(null);
    fetchBooks();
  };

  const handleProgressUpdated = () => {
    setShowProgressEdit(false);
    setEditingProgressBookId(null);
    fetchBooks();
  };

  const getBookProgress = (bookId: string) => {
    return progress.find(p => p.book_id === bookId);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;

    const bookProgress = getBookProgress(book.id);
    const status = bookProgress?.status || 'not_started';

    return status === statusFilter;
  });

  const statusCounts = {
    all: books.length,
    reading: progress.filter(p => p.status === 'reading').length,
    completed: progress.filter(p => p.status === 'completed').length,
    not_started: books.length - progress.filter(p => p.status !== 'not_started').length,
    on_hold: progress.filter(p => p.status === 'on_hold').length,
    abandoned: progress.filter(p => p.status === 'abandoned').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="py-6">
        <AddBookForm 
          onBookAdded={handleBookAdded} 
          onCancel={() => setShowAddForm(false)} 
        />
      </div>
    );
  }

  if (showEditForm && editingBook) {
    return (
      <div className="py-6">
        <EditBookForm 
          book={editingBook}
          onBookUpdated={handleBookUpdated} 
          onCancel={() => { setShowEditForm(false); setEditingBook(null); }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Library</h1>
          <p className="text-muted-foreground">Manage your reading collection</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search books or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input border-border/50"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('all')}
          >
            <Filter className="w-3 h-3 mr-1" />
            All ({statusCounts.all})
          </Badge>
          <Badge
            variant={statusFilter === 'reading' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('reading')}
          >
            Reading ({statusCounts.reading})
          </Badge>
          <Badge
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({statusCounts.completed})
          </Badge>
          <Badge
            variant={statusFilter === 'on_hold' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('on_hold')}
          >
            On Hold ({statusCounts.on_hold})
          </Badge>
          <Badge
            variant={statusFilter === 'abandoned' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('abandoned')}
          >
            Abandoned ({statusCounts.abandoned})
          </Badge>
          <Badge
            variant={statusFilter === 'not_started' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('not_started')}
          >
            To Read ({statusCounts.not_started})
          </Badge>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {books.length === 0 ? 'Start Your Library' : 'No books found'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {books.length === 0 
              ? 'Add your first book to begin tracking your reading journey'
              : 'Try adjusting your search or filters'
            }
          </p>
          {books.length === 0 && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Book
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              progress={getBookProgress(book.id)}
              onViewProgress={() => {
                setSelectedBook(book);
                setShowDetails(true);
              }}
              onEdit={() => {
                setEditingBook(book);
                setShowEditForm(true);
              }}
              onEditProgress={() => {
                setEditingProgressBookId(book.id);
                setShowProgressEdit(true);
              }}
              onDelete={async () => {
                if (confirm('Are you sure you want to delete this book?')) {
                  try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`http://localhost:5000/api/books/${book.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    });

                    if (!response.ok) throw new Error('Failed to delete book');

                    toast({
                      title: "Success",
                      description: "Book deleted successfully",
                    });
                    fetchBooks(); // Refresh the list
                  } catch (error: any) {
                    toast({
                      title: "Error",
                      description: "Failed to delete book",
                      variant: "destructive",
                    });
                  }
                }
              }}
            />
          ))}
        </div>
      )}

      {selectedBook && showDetails && (
        <BookDetailsModal
          book={selectedBook}
          progress={getBookProgress(selectedBook.id)}
          onClose={() => {
            setShowDetails(false);
            setSelectedBook(null);
          }}
        />
      )}

      {showProgressEdit && editingProgressBookId && (
        <Dialog open={showProgressEdit} onOpenChange={() => setShowProgressEdit(false)}>
          <DialogContent className="max-w-md">
            <ProgressEditForm
              bookId={editingProgressBookId}
              initialProgress={getBookProgress(editingProgressBookId)}
              onProgressUpdated={handleProgressUpdated}
              onCancel={() => setShowProgressEdit(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BookLibrary;