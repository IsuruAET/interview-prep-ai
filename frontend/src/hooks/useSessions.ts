import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";
import type {
  Session,
  CreateSessionData,
  CreateSessionResponse,
} from "../types/session";
import toast from "react-hot-toast";
import axios from "axios";

interface SessionError {
  message: string;
}

// Fetch all sessions
export const useGetAllSessions = () => {
  return useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await axiosInstance.get<Session[]>(
        API_PATHS.SESSION.GET_MY_SESSIONS
      );
      return response.data;
    },
  });
};

// Fetch session by ID
export const useGetSessionById = (sessionId: string | undefined) => {
  return useQuery<Session>({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("Session ID is required");
      const response = await axiosInstance.get<Session>(
        API_PATHS.SESSION.GET_SESSION(sessionId)
      );
      return response.data;
    },
    enabled: !!sessionId,
  });
};

// Create session
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation<Session, SessionError, CreateSessionData>({
    mutationFn: async (data: CreateSessionData) => {
      const response = await axiosInstance.post<CreateSessionResponse>(
        API_PATHS.SESSION.CREATE_SESSION,
        data
      );
      return response.data.session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session created successfully!");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create session"
        );
      } else {
        toast.error("Failed to create session");
      }
    },
  });
};

// Delete session
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation<void, SessionError, string>({
    mutationFn: async (sessionId: string) => {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE_SESSION(sessionId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session deleted successfully!");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete session"
        );
      } else {
        toast.error("Failed to delete session");
      }
    },
  });
};
