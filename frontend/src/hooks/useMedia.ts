import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";
import axios from "axios";

interface UploadMediaResponse {
  imageUrl: string;
}

interface UploadMediaError {
  message: string;
}

export const useMedia = () => {
  return useMutation<UploadMediaResponse, UploadMediaError, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post<UploadMediaResponse>(
        API_PATHS.AUTH.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw {
          message:
            error.response?.data?.message ||
            "Failed to upload image. Please try again.",
        };
      }
      throw { message: "Failed to upload image. Please try again." };
    },
  });
};

