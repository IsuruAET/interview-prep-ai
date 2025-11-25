import { Response } from "express";
import Session from "../models/Session";
import Question, { IQuestion } from "../models/Question";
import { AuthenticatedRequest } from "../types/express";

// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
export const createSession = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const userId = req.user!._id;

  try {
    const { role, experience, topicsToFocus, description, questions } =
      req.body || {};

    if (!role || !experience || !topicsToFocus) {
      return res.status(400).json({
        message: "Role, experience, and topicsToFocus are required",
      });
    }

    if (questions && !Array.isArray(questions)) {
      return res.status(400).json({
        message: "Questions must be an array",
      });
    }

    const newSession = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs =
      questions && questions.length > 0
        ? await Promise.all(
            questions.map(
              async (q: {
                question: string;
                answer: string;
                notes?: string;
              }) => {
                const questionDoc = await Question.create({
                  session: newSession._id,
                  question: q.question,
                  answer: q.answer,
                  ...(q.notes && { notes: q.notes }),
                });
                return questionDoc._id;
              }
            )
          )
        : [];

    newSession.questions = questionDocs;
    await newSession.save();

    return res.status(201).json({ success: true, session: newSession });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error creating session", error: error.message });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// @desc    Get a session by ID with populated questions
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const session = await Session.findById(req.params.id!)
      .populate({
        path: "questions",
        options: {
          sort: { isPinned: -1, createdAt: 1 },
        },
      })
      .exec();

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json(session);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error getting session",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// @desc    Get all sessions for the authenticated user
// @route   GET /api/sessions/my-sessions
// @access  Private
export const getMySessions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const userId = req.user!._id;

  try {
    const sessions = await Session.find({ user: userId })
      .populate("questions")
      .sort({ createdAt: -1 });

    return res.status(200).json(sessions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error getting sessions",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// @desc    Delete a session by ID with linked questions
// @route   DELETE /api/sessions/:id
// @access  Private
export const deleteSession = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const session = await Session.findById(req.params.id!);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if the logged-in user owns this session
    if (session.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete all questions associated with the session
    await Question.deleteMany({ session: session._id });

    await Session.findByIdAndDelete(session._id);
    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error deleting session",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};
