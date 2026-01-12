import mongoose from "mongoose";
import Bid from "../models/bidModal.js";
import Gig from "../models/gigModal.js";
import { getIO } from "../config/socket.js";
import Notification from "../models/notificationModal.js";

/* ---------------- CREATE BID ---------------- */
export const createBid = async (req, res) => {
  try {
    const bid = await Bid.create({
      ...req.body,
      userId: req.user._id, // 🔥 ensure consistency
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET BIDS BY GIG ---------------- */
export const getBidsByGig = async (req, res) => {
  try {
    const bids = await Bid.find({ gigId: req.params.gigId });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- HIRE BID (ATOMIC) ---------------- */
export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* ---- Fetch bid ---- */
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) throw new Error("Bid not found");
    if (!bid.userId) throw new Error("Bid user missing");

    /* ---- Fetch gig ---- */
    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) throw new Error("Gig not found");
    if (gig.status === "assigned") throw new Error("Gig already assigned");

    /* ---- Authorization ---- */
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      throw new Error("Not authorized to hire this bid");
    }

    /* ---- DB Updates ---- */
    gig.status = "assigned";
    gig.assignedTo = bid.userId;
    await gig.save({ session });

    bid.status = "hired";
    await bid.save({ session });

    /* ---- Commit transaction FIRST ---- */
    await session.commitTransaction();
    session.endSession();

    /* ---- SOCKET + NOTIFICATION (AFTER COMMIT) ---- */
    const io = getIO();

    const notificationData = {
      type: "BID_HIRED",
      message: "🎉 Your bid has been hired!",
      gigId: gig._id,
      createdAt: new Date(),
    };

    // 🔹 Emit realtime socket notification
    io.to(bid.userId.toString()).emit("notification", notificationData);

    // 🔹 Persist notification to DB
    await Notification.create({
      userId: bid.userId,
      ...notificationData,
    });

    return res.status(200).json({
      message: "Bid hired successfully",
      gig,
      bid,
    });

  } catch (error) {
    // ❗ Only abort if transaction is active
    if (session.inTransaction()) await session.abortTransaction();
    session.endSession();

    console.error("HireBid Error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
