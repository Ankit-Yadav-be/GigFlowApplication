import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import gigRoutes from "./src/routes/gigRoutes.js";
import bidRoutes from "./src/routes/bidRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import connectDB from "./src/config/db.js";
const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "https://gig-flow-application-kw51.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);



app.use(express.json());
app.get("/", (req, res) => {
  res.send(" LocalConnect API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
