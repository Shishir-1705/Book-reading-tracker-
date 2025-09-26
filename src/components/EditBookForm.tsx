import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Save, X } from "lucide-react";

interface EditBookFormProps {
  book: {
    id: string;
    title: string;
    author: string;
    total_pages?: number;
    description?: string;
    genre?: string;
    cover_url?: string;
  };
  onBookUpdated: () => void;
  onCancel: () => void;
}

const EditBookForm = ({ book, onBookUpdated, onCancel }: EditBookFormProps) => {
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    total_pages: book.total_pages?.toString() || '',
    description: book.description || '',
    genre: book.genre || '',
    cover_url: book.cover_url || ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      title: book.title || '',
      author: book.author || '',
      total_pages: book.total_pages?.toString() || '',
      description: book.description || '',
      genre: book.genre || '',
      cover_url: book.cover_url || ''
    });
  }, [book]);

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
      const updateData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        total_pages: formData.total_pages ? parseInt(formData.total_pages) : null,
        description: formData.description.trim() || null,
        genre: formData.genre.trim() || null,
        cover_url: formData.cover_url.trim() || null,
      };

      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update book');

      toast({
        title: "Success!",
        description: "Book updated successfully",
      });

      onBookUpdated();
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
              <CardTitle>Edit Book</CardTitle>
              <CardDescription>Update book details in your library</CardDescription>
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
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Updating...' : 'Update Book'}
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

export default EditBookForm;
