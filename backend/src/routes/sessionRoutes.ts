import { Router } from "express";
import {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
} from "../controllers/sessionControllers";
import { protect } from "../middleware/authMiddleware";
import { ensureDBConnection } from "../middleware/dbMiddleware";

const router = Router();

router.post("/create", ensureDBConnection, protect, createSession);
router.get("/my-sessions", ensureDBConnection, protect, getMySessions);
router.get("/:id", ensureDBConnection, protect, getSessionById);
router.delete("/:id", ensureDBConnection, protect, deleteSession);

export default router;
