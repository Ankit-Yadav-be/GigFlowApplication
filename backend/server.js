import http from "http";
import app from "./app.js";
import { initSocket } from "./src/config/socket.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// 🔹 HTTP server
const server = http.createServer(app);

// 🔹 Socket init
initSocket(server);

// 🔹 IMPORTANT: server.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
