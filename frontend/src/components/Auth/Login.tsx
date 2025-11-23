import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper";

const Login = ({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  // const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");

    // Login API Call
    try {
      // Login API Call
    } catch (error) {
      setError("Something went wrong. Please try again." + error);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="text"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          LOGIN
        </button>
      </form>

      <p className="text-[13px] text-slate-800 mt-3">
        Don't have an account?{" "}
        <button
          type="button"
          className="font-medium text-primary underline cursor-pointer"
          onClick={() => setCurrentPage("signup")}
        >
          SignUp
        </button>
      </p>
    </div>
  );
};

export default Login;
