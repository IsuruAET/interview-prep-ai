import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ButtonSpinner from "../../components/Loader/ButtonSpinner";
import {
  createSessionSchema,
  type CreateSessionFormData,
} from "../../schemas/sessionSchemas";
import { useCreateSession } from "../../hooks/useSessions";

interface CreateSessionFormProps {
  onClose: () => void;
}

const CreateSessionForm = ({ onClose }: CreateSessionFormProps) => {
  const navigate = useNavigate();
  const createSession = useCreateSession();

  const { control, handleSubmit } = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      role: "",
      experience: "",
      topicsToFocus: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateSessionFormData) => {
    try {
      const result = await createSession.mutateAsync(data);
      if (result?._id) {
        onClose();
        navigate(`/interview-prep/${result._id}`);
      }
    } catch (error) {
      // Error is handled by React Query and will be available in createSession.error
      console.error("Create session error:", error);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">
        Start a new interview Journey
      </h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Fill out a few quick details and unlock your personalized set of
        interview questions!
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            name="role"
            control={control}
            label="Role"
            placeholder="(e.g. Software Engineer, Product Manager, etc.)"
            type="text"
            disabled={createSession.isPending}
          />
        </div>

        <div className="mb-4">
          <Input
            name="experience"
            control={control}
            label="Years of Experience"
            placeholder="(e.g. 1 year, 3-5 years, 5+ years, etc.)"
            type="text"
            disabled={createSession.isPending}
          />
        </div>

        <div className="mb-4">
          <Input
            name="topicsToFocus"
            control={control}
            label="Topics to Focus On"
            placeholder="(Comma-Separated List, e.g. JavaScript, React, Node.js, etc.)"
            type="text"
            disabled={createSession.isPending}
          />
        </div>

        <div className="mb-4">
          <Input
            name="description"
            control={control}
            label="Description"
            placeholder="(Any specific goal or notes for this session)"
            type="text"
            disabled={createSession.isPending}
          />
        </div>

        {createSession.error && (
          <p className="text-red-500 text-xs pb-2.5">
            {createSession.error.message}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={createSession.isPending}
        >
          {createSession.isPending ? (
            <>
              <ButtonSpinner />
              CREATING...
            </>
          ) : (
            "CREATE SESSION"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
