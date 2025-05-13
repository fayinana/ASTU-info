import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
