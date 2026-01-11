import Gig from "../models/gigModal.js";

export const createGig = async (req, res) => {
  const gig = await Gig.create({
    ...req.body,
    ownerId: req.user._id,
  });
  res.status(201).json(gig);
};

export const getGigs = async (req, res) => {
  const { search, status } = req.query;

  // Agar status query me diya hai to use filter karo, nahi to sab dikhao
  const query = {
    ...(status ? { status } : {}), // agar status diya hai to filter
    ...(search && { title: { $regex: search, $options: "i" } }),
  };

  const gigs = await Gig.find(query);
  res.json(gigs);
};


export const getGigById = async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return res.status(404).json({ message: "Gig not found" });
  }

  res.json(gig);
};
