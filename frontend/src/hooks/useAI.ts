import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import axios from "axios";

export interface GenerateQuestionsRequest {
  role: string;
  experience: string;
  topicsToFocus: string;
  numberOfQuestions: number;
}

export interface GeneratedQuestion {
  question: string;
  answer: string;
}

export interface GenerateExplanationRequest {
  question: string;
  role?: string;
  experience?: string;
  topicsToFocus?: string;
}

export interface GenerateExplanationResponse {
  title: string;
  explanation: string;
}

export interface GenerateCoverLetterRequest {
  companyDescription: string;
}

export interface GenerateCoverLetterResponse {
  coverLetter: string;
}

interface GenerateQuestionsError {
  message: string;
}

export const useGenerateQuestions = () => {
  return useMutation<
    GeneratedQuestion[],
    GenerateQuestionsError,
    GenerateQuestionsRequest
  >({
    mutationFn: async (data: GenerateQuestionsRequest) => {
      const response = await axiosInstance.post<GeneratedQuestion[]>(
        API_PATHS.AI.GENERATE_QUESTIONS,
        data
      );
      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to generate questions"
        );
      } else {
        toast.error("Failed to generate questions");
      }
    },
  });
};

export const useGenerateExplanation = () => {
  return useMutation<
    GenerateExplanationResponse,
    GenerateQuestionsError,
    GenerateExplanationRequest
  >({
    mutationFn: async (data: GenerateExplanationRequest) => {
      const response = await axiosInstance.post<GenerateExplanationResponse>(
        API_PATHS.AI.GENERATE_EXPLANATION,
        data
      );
      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to generate explanation"
        );
      } else {
        toast.error("Failed to generate explanation");
      }
    },
  });
};

export const useGenerateCoverLetter = () => {
  return useMutation<
    GenerateCoverLetterResponse,
    GenerateQuestionsError,
    GenerateCoverLetterRequest
  >({
    mutationFn: async (data: GenerateCoverLetterRequest) => {
      const response = await axiosInstance.post<GenerateCoverLetterResponse>(
        API_PATHS.AI.GENERATE_COVER_LETTER,
        data
      );
      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to generate cover letter"
        );
      } else {
        toast.error("Failed to generate cover letter");
      }
    },
  });
};
