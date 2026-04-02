import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SENTIMENT_COLORS = {
  positive: "hsl(158, 64%, 52%)",
  neutral: "hsl(43, 96%, 56%)",
  negative: "hsl(0, 72%, 51%)",
};

interface SentimentPieProps {
  data: { positive: number; neutral: number; negative: number };
}

export const SentimentPieChart = ({ data }: SentimentPieProps) => {
  const chartData = [
    { name: "Positive", value: data.positive },
    { name: "Neutral", value: data.neutral },
    { name: "Negative", value: data.negative },
  ];
  const colors = [SENTIMENT_COLORS.positive, SENTIMENT_COLORS.neutral, SENTIMENT_COLORS.negative];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4} strokeWidth={0}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface CategoryBarProps {
  data: { name: string; value: number }[];
}

export const CategoryBarChart = ({ data }: CategoryBarProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">Feedback by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(174, 62%, 40%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
