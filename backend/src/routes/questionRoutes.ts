import { Router } from "express";
import {
  addQuestionToSession,
  togglePinQuestion,
  updateQuestionNote,
} from "../controllers/questionControllers";
import { protect } from "../middleware/authMiddleware";
import { ensureDBConnection } from "../middleware/dbMiddleware";

const router = Router();

router.post("/add", ensureDBConnection, protect, addQuestionToSession);
router.patch("/:id/pin", ensureDBConnection, protect, togglePinQuestion);
router.post("/:id/note", ensureDBConnection, protect, updateQuestionNote);

export default router;
