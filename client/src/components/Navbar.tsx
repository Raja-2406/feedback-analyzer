import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  role?: "customer" | "admin" | null;
}

const Navbar = ({ role }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { user, logout } = useAuth(); // Destruct from context

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    return user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer';
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <BarChart3 className="h-6 w-6 text-accent" />
          FeedPulse
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(getDashboardPath())}>
                <User className="mr-2 h-4 w-4" />
                {user.name || "Profile"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            isLanding && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login/customer")}>
                  Customer Login
                </Button>
                <Button size="sm" onClick={() => navigate("/login/admin")}>
                  Admin Login
                </Button>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
