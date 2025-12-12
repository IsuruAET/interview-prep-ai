import { Router } from "express";
import {
  generateInterviewQuestions,
  generateConceptExplanation,
  generateCoverLetter,
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
router.post(
  "/generate-cover-letter",
  ensureDBConnection,
  protect,
  generateCoverLetter
);

export default router;
