import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import FeedbackCard from "@/components/FeedbackCard";
import { SentimentPieChart, CategoryBarChart } from "@/components/SentimentChart";
import { getSentimentCounts, getCategoryCounts, getAverageRating } from "@/lib/mockData";
import { MessageSquare, Star, TrendingUp, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/mockData";
import { toast } from "sonner";
import FeedbackForm from "@/components/FeedbackForm";

import { fetchFeedback, updateFeedback, deleteFeedback } from "@/lib/api";
import { type Feedback } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const loadFeedback = async () => {
      try {
        const data = await fetchFeedback();
        setFeedbackList(data);
      } catch (error) {
        console.error("Error loading feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeedback();
  }, [user]);

  const allFeedback = feedbackList;
  const filtered = allFeedback.filter((f) => {
    const matchSearch = f.comment.toLowerCase().includes(search.toLowerCase()) || f.userName.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || f.category === filterCategory;
    const matchSent = filterSentiment === "all" || f.sentiment === filterSentiment;
    return matchSearch && matchCat && matchSent;
  });

  const sentimentCounts = getSentimentCounts(filtered);
  const categoryCounts = getCategoryCounts(filtered);
  const avgRating = getAverageRating(filtered);
  const uniqueUsers = new Set(filtered.map((f) => f.userId)).size;

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

  const handleUpdate = async (data: { category: string; rating: number; comment: string }) => {
    if (!editingFeedback) return;
    const id = editingFeedback._id || editingFeedback.id;
    if (!id) throw new Error("Feedback ID missing");

    const sentiment = data.rating >= 4 ? "positive" : data.rating >= 3 ? "neutral" : "negative";

    try {
      const updatedFb = await updateFeedback(id, {
        category: data.category,
        rating: data.rating,
        comment: data.comment,
        sentiment,
      });

      setFeedbackList(feedbackList.map(f => (f._id || f.id) === id ? updatedFb : f));
      setEditingFeedback(null);
    } catch (error) {
      console.error("Error updating feedback:", error);
      throw error;
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Feedback" value={allFeedback.length} icon={MessageSquare} />
          <StatsCard title="Average Rating" value={avgRating.toFixed(1)} icon={Star} />
          <StatsCard title="Positive Rate" value={`${Math.round((sentimentCounts.positive / allFeedback.length) * 100)}%`} icon={TrendingUp} />
          <StatsCard title="Unique Users" value={uniqueUsers} icon={Users} />
        </div>

        {/* Charts */}
        <div className={`mb-8 grid gap-6 ${filterCategory === "all" ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
          <SentimentPieChart data={sentimentCounts} />
          {filterCategory === "all" && <CategoryBarChart data={categoryCounts} />}
        </div>

        {/* Edit Form - Rendered at top if editing */}
        {editingFeedback && (
          <div className="mb-8 max-w-2xl mx-auto">
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Edit Feedback (Admin)</h2>
            <FeedbackForm
              onSubmit={handleUpdate}
              initialData={{
                category: editingFeedback.category,
                rating: editingFeedback.rating,
                comment: editingFeedback.comment
              }}
              isEditing={true}
              onCancelEdit={() => setEditingFeedback(null)}
            />
          </div>
        )}

        {/* Feedback List */}
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">All Feedback Submissions</h2>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSentiment} onValueChange={setFilterSentiment}>
              <SelectTrigger className="sm:w-[160px]">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((f) => (
              <FeedbackCard
                key={f._id || f.id}
                feedback={f}
                showUser
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">No feedback matches your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
