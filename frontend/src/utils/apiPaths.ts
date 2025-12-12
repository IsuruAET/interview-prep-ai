export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login", // Authenticate user and return token
    REGISTER: "/api/v1/auth/register", // Register user and return token
    GET_USER_INFO: "/api/v1/auth/getUser", // Get user info and return user info
    UPDATE_PROFILE_DESCRIPTION: "/api/v1/auth/update-profile-description", // Update profile description and return user info
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/uploadImage", // Upload image and return image url
  },
  AI: {
    GENERATE_QUESTIONS: "/api/v1/ai/generate-questions", // Generate questions and return questions list
    GENERATE_EXPLANATION: "/api/v1/ai/generate-explanation", // Generate explanation and return explanation
    GENERATE_COVER_LETTER: "/api/v1/ai/generate-cover-letter", // Generate cover letter and return cover letter
  },
  SESSION: {
    CREATE_SESSION: "/api/v1/sessions/create", // Create session and return session id
    GET_MY_SESSIONS: "/api/v1/sessions/my-sessions", // Get my sessions and return sessions list
    GET_SESSION: (id: string) => `/api/v1/sessions/${id}`, // Get session and return session
    DELETE_SESSION: (id: string) => `/api/v1/sessions/${id}`, // Delete session and return session
  },
  QUESTION: {
    ADD_QUESTIONS_TO_SESSION: "/api/v1/questions/add", // Add questions to session and return questions list
    UPDATE_PIN_OF_QUESTION: (id: string) => `/api/v1/questions/${id}/pin`, // Pin or Unpin question and return question
    UPDATE_NOTE_OF_QUESTION: (id: string) => `/api/v1/questions/${id}/note`, // Update note of question and return question
  },
};
