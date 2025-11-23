import { Response } from "express";
import Question from "../models/Question";
import Session from "../models/Session";
import { AuthenticatedRequest } from "../types/express";

// @desc    Add a question to a session
// @route   POST /api/questions/add
// @access  Private
export const addQuestionToSession = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { sessionId, questions } = req.body || {};

    console.log(sessionId, questions);

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        message: "Session ID, questions array are required",
      });
    }

    // Verify session exists and user owns it
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Create new questions
    const createdQuestions = await Question.insertMany(
      questions.map((question) => ({
        session: sessionId,
        question: question.question,
        answer: question.answer,
        ...(question.notes && { notes: question.notes }),
      }))
    );

    // Update session to include the new questions
    session.questions.push(...createdQuestions.map((question) => question._id));
    await session.save();

    return res.status(201).json(createdQuestions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error adding question", error: error.message });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// @desc    Toggle pin status of a question
// @route   POST /api/questions/:id/pin
// @access  Private
export const togglePinQuestion = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const question = await Question.findById(req.params.id!)
      .populate({
        path: "session",
        select: "user",
      })
      .exec();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check if the logged-in user owns the session containing this question
    const session = question.session as any;
    if (session.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Toggle pin status
    question.isPinned = !question.isPinned;
    await question.save();

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error toggling pin status",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// @desc    Add note for a question
// @route   POST /api/questions/:id/note
// @access  Private
export const updateQuestionNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { note } = req.body || {};

    const question = await Question.findById(req.params.id!)
      .populate({
        path: "session",
        select: "user",
      })
      .exec();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check if the logged-in user owns the session containing this question
    const session = question.session as any;
    if (session.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update note
    question.notes = note || "";
    await question.save();

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error updating note",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};
