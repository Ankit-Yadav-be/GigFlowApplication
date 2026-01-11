import express from "express";
import {
  createGig,
  getGigs,
  getGigById,
} from "../controllers/gigController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGig);

router.get("/", getGigs);

router.get("/:id", getGigById);

export default router;
