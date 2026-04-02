import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Send, X } from "lucide-react";
import { CATEGORIES } from "@/lib/mockData";
import { toast } from "sonner";

interface FeedbackFormProps {
  onSubmit: (data: { category: string; rating: number; comment: string }) => Promise<void> | void;
  initialData?: { category: string; rating: number; comment: string };
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

const FeedbackForm = ({ onSubmit, initialData, isEditing, onCancelEdit }: FeedbackFormProps) => {
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialData?.comment || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setRating(initialData.rating);
      setComment(initialData.comment);
    } else {
      setCategory("");
      setRating(0);
      setComment("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !rating || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ category, rating, comment });
      if (!isEditing) {
        setCategory("");
        setRating(0);
        setComment("");
      }
      toast.success(isEditing ? "Feedback updated successfully!" : "Feedback submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">Submit Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="rounded p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${star <= (hoveredRating || rating)
                      ? "fill-chart-neutral text-chart-neutral"
                      : "text-muted"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Comments</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your detailed feedback..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? (isEditing ? "Updating..." : "Submitting...") : (isEditing ? "Update Feedback" : "Submit Feedback")}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
