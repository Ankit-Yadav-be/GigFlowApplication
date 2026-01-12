import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import gigRoutes from "./src/routes/gigRoutes.js";
import bidRoutes from "./src/routes/bidRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

const app = express();

/* DB */
connectDB();

/* CORS */
app.use(
  cors({
    origin: [
      "https://gig-flow-application-kw51.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* IMPORTANT */
app.use(express.json());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
