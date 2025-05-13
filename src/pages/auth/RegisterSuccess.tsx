import { Button } from "./../../components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const RegisterSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Registration Successful</h1>
        <p className="text-muted-foreground mb-6">
          Your account has been created and is pending approval by an
          administrator. You'll be notified once your account is approved.
        </p>

        <Button asChild className="w-full bg-primary">
          <Link to="/login">Return to Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default RegisterSuccess;
