import { Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { AuthenticatedRequest } from "../types/express";
import {
  generateConceptExplanationPrompt,
  generateInterviewQuestionsPrompt,
} from "../utils/prompts";

// Initialize Google GenAI client
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || "",
});

// @desc    Generate interview questions based on role, experience, and topics
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateInterviewQuestions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } =
      req.body || {};

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({
        message:
          "Role, experience, topicsToFocus, and numberOfQuestions are required",
      });
    }

    // Ensure topicsToFocus is an array
    const topicsArray = Array.isArray(topicsToFocus)
      ? topicsToFocus
      : typeof topicsToFocus === "string"
      ? [topicsToFocus]
      : [];

    const prompt = generateInterviewQuestionsPrompt(
      role,
      experience,
      topicsArray,
      numberOfQuestions
    );

    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured",
      });
    }

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const rawText = response.text || "";

    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // Remove starting ```json
      .replace(/```$/, "") // Remove ending ```
      .trim(); // Remove any extra whitespace

    const data = JSON.parse(cleanedText);

    return res.status(200).json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error generating interview questions",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// @desc    Generate explanation for a concept
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured",
      });
    }

    const prompt = generateConceptExplanationPrompt(question);

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const rawText = response.text || "";

    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // Remove starting ```json
      .replace(/```$/, "") // Remove ending ```
      .trim(); // Remove any extra whitespace

    const data = JSON.parse(cleanedText);

    return res.status(200).json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error generating concept explanation",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};
