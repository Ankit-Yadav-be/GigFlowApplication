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
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) throw new Error("Bid not found");

    const gig = await Gig.findOne({
      _id: bid.gigId,
      ownerId: req.user._id,
      status: "open",
    }).session(session);

    if (!gig) throw new Error("Gig already assigned");

    // reject other bids
    await Bid.updateMany(
      { gigId: gig._id },
      { status: "rejected" },
      { session }
    );

    bid.status = "hired";
    await bid.save({ session });

    gig.status = "assigned";
    await gig.save({ session });

    //  Create notification
    const notification = await Notification.create({
      user: bid.freelancerId,
      type: "HIRED",
      message: `You have been hired for ${gig.title}`,
      gig: gig._id,
    });

    await session.commitTransaction();

    //  SOCKET EVENT
    getIO().to(bid.freelancerId.toString()).emit("notification", notification);

    res.json({ message: "Freelancer hired successfully", notification });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};
