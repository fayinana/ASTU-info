import { LoginForm } from "./../../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
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
      </div>

      <LoginForm />
    </div>
  );
};

export default Login;
