import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Edit, X } from "lucide-react";

interface ProgressEditFormProps {
  bookId: string;
  initialProgress?: {
    current_page?: number;
    status?: string;
    rating?: number;
    notes?: string;
  };
  onProgressUpdated: () => void;
  onCancel: () => void;
}

const ProgressEditForm = ({ bookId, initialProgress, onProgressUpdated, onCancel }: ProgressEditFormProps) => {
  type StatusType = 'not_started' | 'reading' | 'completed' | 'on_hold' | 'abandoned';

  const [formData, setFormData] = useState({
    current_page: initialProgress?.current_page || 0,
    status: (initialProgress?.status as StatusType) || 'not_started',
    rating: initialProgress?.rating || 0,
    notes: initialProgress?.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      current_page: initialProgress?.current_page || 0,
      status: (initialProgress?.status as StatusType) || 'not_started',
      rating: initialProgress?.rating || 0,
      notes: initialProgress?.notes || ''
    });
  }, [initialProgress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (!token || !storedUser) {
        throw new Error('Not authenticated');
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      const progressData = {
        book_id: bookId,
        user_id: userId,
        current_page: formData.current_page > 0 ? formData.current_page : null,
        status: formData.status,
        rating: formData.rating > 0 ? formData.rating : null,
        notes: formData.notes.trim() || null,
      };

      // Check if progress record already exists by trying to fetch it
      const checkResponse = await fetch(`http://localhost:5000/api/reading-progress/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!checkResponse.ok) throw new Error('Failed to check existing progress');
      const existingProgress = await checkResponse.json();
      const existingRecord = existingProgress.find((p: any) => p.book_id === bookId);

      if (existingRecord) {
        // Update existing record
        const updateResponse = await fetch(`http://localhost:5000/api/reading-progress/${existingRecord._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(progressData),
        });

        if (!updateResponse.ok) throw new Error('Failed to update progress');
      } else {
        // Insert new record
        const createResponse = await fetch('http://localhost:5000/api/reading-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(progressData),
        });

        if (!createResponse.ok) throw new Error('Failed to create progress');
      }

      toast({
        title: "Success!",
        description: "Reading progress updated",
      });

      onProgressUpdated();
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Update Reading Progress
        </CardTitle>
        <CardDescription>Track your progress for this book</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="bg-input border-border/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_page">Current Page</Label>
            <Input
              id="current_page"
              type="number"
              min="0"
              value={formData.current_page}
              onChange={(e) => handleInputChange('current_page', parseInt(e.target.value) || 0)}
              placeholder="Enter current page"
              className="bg-input border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Slider
              min={0}
              max={5}
              step={1}
              value={[formData.rating]}
              onValueChange={(value) => handleInputChange('rating', value[0])}
              className="bg-input border-border/50"
            />
            <p className="text-sm text-muted-foreground">{formData.rating || 0} / 5</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Your thoughts about the book..."
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
              <BookOpen className="w-4 h-4 mr-2" />
              {loading ? 'Updating...' : 'Update Progress'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProgressEditForm;
