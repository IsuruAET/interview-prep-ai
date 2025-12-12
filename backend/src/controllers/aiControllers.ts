import { Response } from "express";
import Groq from "groq-sdk";
import { AuthenticatedRequest } from "../types/express";
import {
  generateConceptExplanationPrompt,
  generateInterviewQuestionsPrompt,
} from "../utils/prompts";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
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

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "Groq API key is not configured",
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const rawText = response.choices[0]?.message?.content || "";

    // Clean it: Remove ```json and ``` from beginning and end (if present)
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // Remove starting ```json
      .replace(/```$/, "") // Remove ending ```
      .trim(); // Remove any extra whitespace

    const parsedData = JSON.parse(cleanedText);
    
    // Extract questions array if it exists, otherwise return the data as-is
    const data = parsedData.questions || parsedData;

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

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "Groq API key is not configured",
      });
    }

    const prompt = generateConceptExplanationPrompt(question);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const rawText = response.choices[0]?.message?.content || "";

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
