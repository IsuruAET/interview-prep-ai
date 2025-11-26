import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import axios from "axios";

interface QuestionError {
  message: string;
}

export interface AddQuestionsPayload {
  sessionId: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

export const useUpdateQuestionPinStatus = () => {
  return useMutation<void, QuestionError, string>({
    mutationFn: async (questionId: string) => {
      await axiosInstance.patch(
        API_PATHS.QUESTION.UPDATE_PIN_OF_QUESTION(questionId)
      );
    },
    onSuccess: () => {
      toast.success("Question pin status updated");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update pin status"
        );
      } else {
        toast.error("Failed to update pin status");
      }
    },
  });
};

export const useAddQuestionsToSession = () => {
  return useMutation<void, QuestionError, AddQuestionsPayload>({
    mutationFn: async (payload: AddQuestionsPayload) => {
      await axiosInstance.post(
        API_PATHS.QUESTION.ADD_QUESTIONS_TO_SESSION,
        payload
      );
    },
    onSuccess: () => {
      toast.success("Questions added successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add questions");
      } else {
        toast.error("Failed to add questions");
      }
    },
  });
};


