import { Response } from "express";
import Groq from "groq-sdk";
import { AuthenticatedRequest } from "../types/express";
import {
  generateConceptExplanationPrompt,
  generateInterviewQuestionsPrompt,
  generateCoverLetterPrompt,
  generateMatchAnalysisPrompt,
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

// @desc    Generate cover letter based on profile and company description
// @route   POST /api/ai/generate-cover-letter
// @access  Private
export const generateCoverLetter = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { companyDescription } = req.body || {};

    if (!companyDescription) {
      return res.status(400).json({
        message: "Company description is required",
      });
    }

    // Get user's profile description
    const User = (await import("../models/User")).default;
    const user = await User.findById(req.user?._id).select(
      "profileDescription"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.profileDescription) {
      return res.status(400).json({
        message:
          "Profile description is required. Please save your profile first.",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "Groq API key is not configured",
      });
    }

    // Generate match analysis
    const matchPrompt = generateMatchAnalysisPrompt(
      user.profileDescription,
      companyDescription
    );

    const matchResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: matchPrompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const matchRawText = matchResponse.choices[0]?.message?.content || "";
    const matchCleanedText = matchRawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    let matchAnalysis = { matchPercentage: 0, matchSummary: "" };
    try {
      const matchParsed = JSON.parse(matchCleanedText);
      matchAnalysis = {
        matchPercentage: matchParsed.matchPercentage || 0,
        matchSummary: matchParsed.matchSummary || "",
      };
    } catch {
      // If match analysis fails, continue with default values
    }

    // Generate cover letter
    const prompt = generateCoverLetterPrompt(
      user.profileDescription,
      companyDescription
    );

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

    // Extract coverLetter if it exists, otherwise return the data as-is
    const data = parsedData.coverLetter || parsedData;

    return res.status(200).json({
      coverLetter: data,
      matchPercentage: matchAnalysis.matchPercentage,
      matchSummary: matchAnalysis.matchSummary,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error generating cover letter",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};
