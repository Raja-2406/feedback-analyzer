import { useState, useEffect } from "react";
import { fetchFeedback, submitFeedback, updateFeedback, deleteFeedback } from "@/lib/api";
import Navbar from "@/components/Navbar";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackCard from "@/components/FeedbackCard";
import StatsCard from "@/components/StatsCard";
import FeedPulseChatbot from "@/components/FeedPulseChatbot";
import { getAverageRating, type Feedback } from "@/lib/mockData";
import { MessageSquare, Star, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

declare const puter: any;

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  // Fetch feedback on mount
  useEffect(() => {
    if (!user) return;

    const loadFeedback = async () => {
      try {
        const data = await fetchFeedback(user.id);
        setFeedbackList(data);
      } catch (error) {
        console.error("Error loading feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeedback();
  }, [user]);

  const myFeedback = feedbackList;
  const avgRating = getAverageRating(myFeedback);

  const handleSubmit = async (data: { category: string; rating: number; comment: string }) => {
    if (!user) return;

    try {
      // Puter.js Sentiment Hack
      let sentiment = 'neutral';
      try {
        const aiResponse = await puter.ai.chat(`Reply with exactly ONE word: "positive", "negative", or "neutral". Ignore the star rating. Based purely on the text, what is the sentiment of this feedback? Pay attention to sarcasm: "${data.comment}"`);
        const responseText = aiResponse.message.content.trim().toLowerCase();

        if (responseText.includes('positive')) sentiment = 'positive';
        else if (responseText.includes('negative')) sentiment = 'negative';
      } catch (puterError) {
        console.error("Puter NLP Error:", puterError);
        // Fallback to strict star rating
        sentiment = data.rating >= 4 ? "positive" : data.rating >= 3 ? "neutral" : "negative";
      }

      if (editingFeedback) {
        const id = editingFeedback._id || editingFeedback.id;
        if (!id) throw new Error("Feedback ID missing");

        const updatedFb = await updateFeedback(id, {
          category: data.category,
          rating: data.rating,
          comment: data.comment,
          sentiment,
        });

        setFeedbackList(feedbackList.map(f => (f._id || f.id) === id ? updatedFb : f));
        setEditingFeedback(null);
      } else {
        const newFb = await submitFeedback({
          userId: user.id,
          userName: user.name,
          category: data.category,
          rating: data.rating,
          comment: data.comment,
          sentiment, // Send the puter calculated sentiment
        } as any);

        setFeedbackList([newFb, ...feedbackList]);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await deleteFeedback(id);
      setFeedbackList(feedbackList.filter((f) => (f._id || f.id) !== id));
      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="customer" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 font-display text-3xl font-bold text-foreground">
          Welcome, {user.name}
        </h1>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatsCard title="My Submissions" value={myFeedback.length} icon={MessageSquare} />
          <StatsCard title="Avg. Rating Given" value={avgRating.toFixed(1)} icon={Star} />
          <StatsCard title="Last Submitted" value={myFeedback.length ? "Recently" : "Never"} icon={Clock} />
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
              {editingFeedback ? "Edit Feedback" : "Submit Feedback"}
            </h2>
            <FeedbackForm
              onSubmit={handleSubmit}
              initialData={editingFeedback ? {
                category: editingFeedback.category,
                rating: editingFeedback.rating,
                comment: editingFeedback.comment
              } : undefined}
              isEditing={!!editingFeedback}
              onCancelEdit={editingFeedback ? () => setEditingFeedback(null) : undefined}
            />
          </div>

          {/* History */}
          <div className="lg:col-span-3">
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">My Feedback History</h2>
            <div className="space-y-4">
              {isLoading ? (
                <p>Loading feedback...</p>
              ) : myFeedback.length > 0 ? (
                myFeedback.map((f) => (
                  <FeedbackCard
                    key={f._id || f.id}
                    feedback={f}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No feedback submitted yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <FeedPulseChatbot />
    </div>
  );
};

export default CustomerDashboard;
