import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
}

export const useGetUserInfo = () => {
  const token = localStorage.getItem("token");

  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get<User>(
        API_PATHS.AUTH.GET_USER_INFO
      );
      return response.data;
    },
    enabled: !!token, // Only run if token exists
    retry: false, // Don't retry on failure (will handle redirect)
    staleTime: Infinity, // Consider data fresh forever (until manual invalidation)
  });
};
