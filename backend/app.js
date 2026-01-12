import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import gigRoutes from "./src/routes/gigRoutes.js";
import bidRoutes from "./src/routes/bidRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

const app = express();

/* ✅ CONNECT DB */
connectDB();

/* ✅ CORS CONFIG */
const allowedOrigins = [
  "https://gig-flow-application-kw51.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ VERY IMPORTANT (preflight fix) */
app.options("*", cors());

/* MIDDLEWARE */
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
