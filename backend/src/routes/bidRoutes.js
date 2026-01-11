import express from "express";
import {
  createBid,
  getBidsByGig,
  hireBid,
} from "../controllers/bidController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBid);

router.get("/:gigId", protect, getBidsByGig);

router.patch("/hire/:bidId", protect, hireBid);

export default router;
