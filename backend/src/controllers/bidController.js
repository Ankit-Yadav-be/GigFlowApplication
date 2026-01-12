import mongoose from "mongoose";
import Bid from "../models/bidModal.js";
import Gig from "../models/gigModal.js";
import { getIO } from "../config/socket.js";
import Notification from "../models/notificationModal.js";

export const createBid = async (req, res) => {
  const bid = await Bid.create({
    ...req.body,
    freelancerId: req.user._id,
  });
  res.status(201).json(bid);
};

export const getBidsByGig = async (req, res) => {
  const bids = await Bid.find({ gigId: req.params.gigId });
  res.json(bids);
};

//  ATOMIC HIRE LOGIC
export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) {
      throw new Error("Bid not found");
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      throw new Error("Gig not found");
    }

    if (gig.status === "assigned") {
      throw new Error("Gig already assigned");
    }

    // DB updates
    gig.status = "assigned";
    gig.assignedTo = bid.userId;
    await gig.save({ session });

    bid.status = "hired";
    await bid.save({ session });

    // ✅ COMMIT FIRST
    await session.commitTransaction();
    session.endSession();

    // 🔥 NON-DB WORK AFTER COMMIT
    const io = getIO();
    io.to(bid.userId.toString()).emit("notification", {
      type: "BID_HIRED",
      message: "🎉 Your bid has been hired!",
      gigId: gig._id,
    });

    return res.status(200).json({
      message: "Bid hired successfully",
      gig,
      bid,
    });

  } catch (error) {
    // ❗ abort ONLY if transaction is active
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    console.error("HireBid Error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
