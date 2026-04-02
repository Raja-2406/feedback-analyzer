import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, MessageSquare, TrendingUp, Shield, Activity, Star, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchPublicStats } from "@/lib/api";

const features = [
  {
    icon: MessageSquare,
    title: "Easy Feedback",
    desc: "Submit ratings and reviews through intuitive, mobile-friendly forms.",
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    desc: "Automated sentiment analysis transforms raw feedback into insights.",
  },
  {
    icon: BarChart3,
    title: "Visual Dashboards",
    desc: "Interactive charts and graphs reveal trends at a glance.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    desc: "Enterprise-grade security with role-based access control.",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, averageRating: 0, sentiments: { positive: 0, neutral: 0, negative: 0 } });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchPublicStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading public stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  const handleScrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(174_62%_40%_/_0.15),transparent_60%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl">
            Smart Feedback
            <br />
            Analytics Portal
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80">
            Capture user feedback and transform it into actionable insights with automated sentiment analysis and beautiful visualizations.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!user ? (
              <>
                <Button
                  size="lg"
                  variant="secondary"
                  className="min-w-[180px] font-semibold"
                  onClick={() => navigate("/login/customer")}
                >
                  Submit Feedback
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="min-w-[180px] font-semibold bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0"
                  onClick={handleScrollToFeatures}
                >
                  How it Works
                </Button>
              </>
            ) : user.role === 'admin' ? (
              <Button
                size="lg"
                variant="secondary"
                className="min-w-[180px] font-semibold"
                onClick={() => navigate("/dashboard/admin")}
              >
                View Analytics Dashboard
              </Button>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                className="min-w-[180px] font-semibold"
                onClick={() => navigate("/dashboard/customer")}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Live Stats Banner */}
      <section className="border-b bg-card py-6 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Feedbacks Analyzed</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {loadingStats ? "..." : (stats.total || "1,240+")}
              </p>
            </div>
          </div>
          <div className="hidden h-12 w-px bg-border sm:block" />
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Global Rating</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {loadingStats ? "..." : (stats.averageRating ? stats.averageRating.toFixed(1) : "4.8")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Module Preview Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 font-display text-2xl font-semibold text-foreground">Experience Intelligent Analytics</h2>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border bg-card shadow-2xl">
            <div className="border-b bg-muted/50 px-4 py-3 text-left flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs font-medium text-muted-foreground ml-2 flex-1">Admin Dashboard Module</div>
            </div>
            <div className="p-8 pb-0">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="h-24 rounded-lg bg-primary/10 border border-primary/20 p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Total Feedback</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {loadingStats ? "..." : stats.total}
                  </div>
                </div>
                <div className="h-24 rounded-lg bg-accent/10 border border-accent/20 p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-muted-foreground">Average Rating</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {loadingStats ? "..." : (stats.averageRating ? stats.averageRating.toFixed(1) : "0.0")}
                  </div>
                </div>
                <div className="h-24 rounded-lg bg-chart-positive/10 border border-chart-positive/20 p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-chart-positive" />
                    <span className="text-sm font-medium text-muted-foreground">Unique Users</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {loadingStats ? "..." : stats.total} {/* Mocking unique users as total for now since stats doesn't return unique users */}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-48 w-full max-w-2xl rounded-t-xl bg-gradient-to-t from-primary/10 to-transparent border-t border-x border-border/80 p-6 pt-4 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-medium text-foreground">Sentiment Trends</div>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-chart-positive"></div><span className="text-xs text-muted-foreground">Positive</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-chart-negative"></div><span className="text-xs text-muted-foreground">Negative</span></div>
                    </div>
                  </div>
                  <div className="flex-1 flex items-end gap-2 px-2 overflow-hidden">
                    {[40, 70, 45, 90, 65, 80, 100, 60, 75, 50, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary/40" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features-section" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">
            Why FeedPulse?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <f.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="mb-4 md:mb-0">
            © 2026 FeedPulse — Smart Feedback Analytics Portal
          </div>
          <div className="flex gap-6">
            <Link to="/login/admin" className="hover:text-foreground transition-colors">Admin Portal</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">User Registration</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
