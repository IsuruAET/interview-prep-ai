import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Input from "../Inputs/Input";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/authSchemas";
import { useRegister } from "../../hooks/useAuth";
import { useMedia } from "../../hooks/useMedia";

const SignUp = ({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const uploadImageMutation = useMedia();

  const { handleSubmit, control } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      let profileImageUrl = "";

      // Upload image if present
      if (data.profileImage) {
        try {
          const imgUploadResponse = await uploadImageMutation.mutateAsync(
            data.profileImage
          );
          profileImageUrl = imgUploadResponse.imageUrl || "";
        } catch (error) {
          console.error("Image upload error:", error);
          // Continue with registration even if image upload fails
        }
      }

      const response = await registerMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        profileImageUrl: profileImageUrl || undefined,
      });

      if (response.token) {
        navigate("/dashboard");
      }
    } catch (error) {
      // Error is handled by React Query and will be available in registerMutation.error
      console.error("Signup error:", error);
    }
  };

  const isLoading = registerMutation.isPending || uploadImageMutation.isPending;

  return (
    <div className="w-full max-w-[90vw] sm:max-w-md md:w-[33vw] p-5 sm:p-7 flex flex-col justify-center">
      <h3 className="text-base sm:text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-4 sm:mb-6">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <ProfilePhotoSelector
          name="profileImage"
          control={control}
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 gap-2">
          <Input
            name="fullName"
            control={control}
            label="Full Name"
            placeholder="John"
            type="text"
            disabled={isLoading}
          />

          <Input
            name="email"
            control={control}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
            disabled={isLoading}
          />

          <Input
            name="password"
            control={control}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
            disabled={isLoading}
          />
        </div>

        {registerMutation.error && (
          <p className="text-red-500 text-xs pb-2.5">
            {registerMutation.error.message}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "SIGNING UP..." : "SIGN UP"}
        </button>
      </form>

      <p className="text-[13px] text-slate-800 mt-3">
        Already have an account?{" "}
        <button
          type="button"
          className="font-medium text-primary underline cursor-pointer"
          onClick={() => setCurrentPage("login")}
          disabled={isLoading}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignUp;
