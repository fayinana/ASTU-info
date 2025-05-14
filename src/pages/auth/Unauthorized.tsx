import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Navigate based on user role
    switch (user.role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "teacher":
        navigate("/teacher/dashboard");
        break;
      case "student":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/login");
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. If you believe this is
          an error, please contact an administrator.
        </p>

        <div className="space-y-2">
          <Button onClick={handleGoHome} className="w-full bg-primary">
            Go to Dashboard
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Sign in with different account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
