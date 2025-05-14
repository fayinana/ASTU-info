import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Redirect based on user role
    switch (user.role) {
      case "admin":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "teacher":
        navigate("/teacher/dashboard", { replace: true });
        break;
      case "student":
        navigate("/student/dashboard", { replace: true });
        break;
      default:
        navigate("/login", { replace: true });
        break;
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md mb-6 flex flex-col items-center justify-center pt-4">
        <div className="w-20 h-20 ">
          <img
            src="https://estudent.astu.edu.et/dist/img/astu_logo.svg"
            alt="logo"
          />
        </div>
        <h1 className="text-center mt-2">
          <span className="text-2xl font-bold">ASTU</span>
          <span className="text-2xl"> - Info</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default Index;
