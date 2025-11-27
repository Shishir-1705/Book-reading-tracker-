import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Plus, X } from "lucide-react";

interface AddBookFormProps {
  onBookAdded: () => void;
  onCancel: () => void;
}

const AddBookForm = ({ onBookAdded, onCancel }: AddBookFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    total_pages: '',
    description: '',
    genre: '',
    cover_url: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      toast({
        title: "Error",
        description: "Please fill in at least the title and author",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (!token || !storedUser) {
        throw new Error('Not authenticated');
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      const bookData = {
        user_id: userId,
        title: formData.title.trim(),
        author: formData.author.trim(),
        total_pages: formData.total_pages ? parseInt(formData.total_pages) : null,
        description: formData.description.trim() || null,
        genre: formData.genre.trim() || null,
        cover_url: formData.cover_url.trim() || "https://via.placeholder.com/200x300/4a5568/ffffff?text=Book+Cover"
      };

      let response;
      try {
        console.log('Sending request to:', 'http://localhost:5000/api/books');
        console.log('With token:', token ? 'Present' : 'Missing');
        response = await fetch('http://localhost:5000/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(bookData),
          mode: 'cors',
          credentials: 'include'
        });
        console.log('Response status:', response.status, response.statusText);
      } catch (networkError: any) {
        // Handle network errors (server not running, CORS, etc.)
        console.error('Network error details:', {
          message: networkError.message,
          name: networkError.name,
          stack: networkError.stack
        });
        throw new Error('Cannot connect to server. Please make sure the backend server is running on port 5000. Error: ' + (networkError.message || 'Connection refused'));
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to add book';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "Success!",
        description: "Book added to your library",
      });

      onBookAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto bg-gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Add New Book</CardTitle>
              <CardDescription>Add a book to your reading library</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Book title"
                required
                className="bg-input border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Author name"
                required
                className="bg-input border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_pages">Total Pages</Label>
              <Input
                id="total_pages"
                type="number"
                value={formData.total_pages}
                onChange={(e) => handleInputChange('total_pages', e.target.value)}
                placeholder="Number of pages"
                className="bg-input border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                placeholder="e.g. Fiction, Mystery, Romance"
                className="bg-input border-border/50"
              />
            </div>


          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_url">Cover Image URL</Label>
            <Input
              id="cover_url"
              value={formData.cover_url}
              onChange={(e) => handleInputChange('cover_url', e.target.value)}
              placeholder="URL to book cover image (optional)"
              className="bg-input border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Book description or synopsis"
              rows={3}
              className="bg-input border-border/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? 'Adding...' : 'Add Book'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBookForm;
