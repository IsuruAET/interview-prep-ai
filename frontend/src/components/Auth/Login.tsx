import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Input from "../Inputs/Input";
import { loginSchema, type LoginFormData } from "../../schemas/authSchemas";
import { useLogin } from "../../hooks/useAuth";

const Login = ({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const { handleSubmit, control } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response.token) {
        navigate("/dashboard");
      }
    } catch (error) {
      // Error is handled by React Query and will be available in loginMutation.error
      console.error("Login error:", error);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            name="email"
            control={control}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
            disabled={loginMutation.isPending}
          />
        </div>

        <div className="mb-4">
          <Input
            name="password"
            control={control}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
            disabled={loginMutation.isPending}
          />
        </div>

        {loginMutation.error && (
          <p className="text-red-500 text-xs pb-2.5">
            {loginMutation.error.message}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      <p className="text-[13px] text-slate-800 mt-3">
        Don't have an account?{" "}
        <button
          type="button"
          className="font-medium text-primary underline cursor-pointer"
          onClick={() => setCurrentPage("signup")}
          disabled={loginMutation.isPending}
        >
          SignUp
        </button>
      </p>
    </div>
  );
};

export default Login;
