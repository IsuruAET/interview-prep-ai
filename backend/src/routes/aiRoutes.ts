import { Router } from "express";
import {
  generateInterviewQuestions,
  generateConceptExplanation,
} from "../controllers/aiControllers";
import { protect } from "../middleware/authMiddleware";
import { ensureDBConnection } from "../middleware/dbMiddleware";

const router = Router();

router.post(
  "/generate-questions",
  ensureDBConnection,
  protect,
  generateInterviewQuestions
);
router.post(
  "/generate-explanation",
  ensureDBConnection,
  protect,
  generateConceptExplanation
);

export default router;
