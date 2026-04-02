import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User, MessageCircle, Send, Trash2, Edit } from "lucide-react";
import type { Feedback, Message } from "@/lib/mockData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMessage } from "@/lib/api";
import { toast } from "sonner";

const sentimentColors: Record<string, string> = {
  positive: "bg-chart-positive/10 text-chart-positive border-chart-positive/30",
  neutral: "bg-chart-neutral/10 text-chart-neutral border-chart-neutral/30",
  negative: "bg-chart-negative/10 text-chart-negative border-chart-negative/30",
};

interface FeedbackCardProps {
  feedback: Feedback;
  showUser?: boolean;
  onEdit?: (feedback: Feedback) => void;
  onDelete?: (id: string) => void;
}

const FeedbackCard = ({ feedback, showUser = false, onEdit, onDelete }: FeedbackCardProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(feedback.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const feedbackId = feedback._id || feedback.id;
    if (!feedbackId) return;

    setIsSubmitting(true);
    try {
      const updatedFeedback = await addMessage(feedbackId, newMessage);
      setMessages(updatedFeedback.messages);
      setNewMessage("");
      toast.success("Reply sent!");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card transition-all duration-300 hover:shadow-card-hover">
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium">
              {feedback.category}
            </Badge>
            <Badge className={`border text-xs ${sentimentColors[feedback.sentiment]}`}>
              {feedback.sentiment}
            </Badge>
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < feedback.rating ? "fill-chart-neutral text-chart-neutral" : "text-muted"}`}
              />
            ))}
          </div>
        </div>

        <p className="mb-3 text-sm leading-relaxed text-foreground">{feedback.comment}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {/* Chat Drawer */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 text-xs flex gap-1.5 ${isChatOpen ? "bg-muted text-primary" : ""}`}
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {messages.length > 0 ? `${messages.length} Replies` : "Reply"}
            </Button>

            {showUser && (
              <span className="flex items-center gap-1 border-l pl-2 ml-1">
                <User className="h-3 w-3" />
                {feedback.userName}
              </span>
            )}
            <span className={!showUser ? "border-l pl-2 ml-1" : ""}>{format(new Date(feedback.createdAt), "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onEdit(feedback)}>
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => onDelete(feedback._id || feedback.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Chat Drawer */}
        {isChatOpen && (
          <div className="mt-4 pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2 flex flex-col">
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">No replies yet. Start the conversation!</p>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.senderRole === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {msg.senderRole !== 'admin' && <Badge variant="outline" className="mr-1 px-1 py-0 text-[8px] h-3">CUSTOMER</Badge>}
                        {msg.senderName}
                        {msg.senderRole === 'admin' && <Badge variant="secondary" className="ml-1 px-1 py-0 text-[8px] h-3">ADMIN</Badge>}
                      </span>
                    </div>
                    <div className={`text-xs px-3 py-2 rounded-xl max-w-[85%] ${msg.senderRole === 'admin'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 pt-1 mt-auto">
              <Input
                size={1}
                placeholder="Type a reply..."
                className="h-8 text-xs focus-visible:ring-1"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isSubmitting}
              />
              <Button
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSubmitting}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
