export interface Message {
  senderRole: 'customer' | 'admin';
  senderName: string;
  text: string;
  timestamp?: string;
}

export interface Feedback {
  _id?: string;
  id: string;
  userId: string;
  userName: string;
  category: string;
  rating: number;
  comment: string;
  sentiment: "positive" | "neutral" | "negative";
  messages?: Message[];
  createdAt: string;
}

export const CATEGORIES = [
  "Course Content",
  "Teaching Quality",
  "Infrastructure",
  "Library Services",
  "Campus Life",
  "Administration",
];

const names = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Lee", "Emma Wilson", "Frank Brown", "Grace Chen", "Henry Park"];

function randomSentiment(rating: number): "positive" | "neutral" | "negative" {
  if (rating >= 4) return "positive";
  if (rating >= 3) return "neutral";
  return "negative";
}

export const mockFeedback: Feedback[] = Array.from({ length: 24 }, (_, i) => {
  const rating = Math.floor(Math.random() * 5) + 1;
  const cat = CATEGORIES[i % CATEGORIES.length];
  const name = names[i % names.length];
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 30));
  return {
    id: `fb-${i + 1}`,
    userId: `user-${(i % 8) + 1}`,
    userName: name,
    category: cat,
    rating,
    comment: [
      "The overall experience was great and I learned a lot.",
      "Could be improved, but decent overall.",
      "Not satisfied with the current state. Needs work.",
      "Excellent quality, exceeded expectations!",
      "Average experience, nothing special.",
      "Very disappointed with the service provided.",
      "Good improvements from last time, keep it up!",
      "Needs significant changes to meet standards.",
    ][i % 8],
    sentiment: randomSentiment(rating),
    createdAt: d.toISOString(),
  };
});

export function getSentimentCounts(data: Feedback[]) {
  return data.reduce(
    (acc, f) => {
      acc[f.sentiment]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );
}

export function getCategoryCounts(data: Feedback[]) {
  const counts: Record<string, number> = {};
  data.forEach((f) => {
    counts[f.category] = (counts[f.category] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function getAverageRating(data: Feedback[]) {
  if (!data.length) return 0;
  return data.reduce((sum, f) => sum + f.rating, 0) / data.length;
}
