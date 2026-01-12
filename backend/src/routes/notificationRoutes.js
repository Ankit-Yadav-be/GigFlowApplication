import express from "express";
import Notification from "../models/notificationModal.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// get all notifications for logged-in user
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(notifications);
});

// mark as read
router.patch("/:id/read", protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: "Notification marked as read" });
});

export default router;
