import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sequelize } from "./src/models/index.js";
import userRoutes from "./src/routes/userRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import socketHandler from "./src/sockets/socketHandler.js";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST"], // Allowed methods
    credentials: true, // Include credentials if necessary
  },
});

// Middleware
app.use(bodyParser.json());
// Middleware for CORS
app.use(cors({
  origin: "*", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Include credentials if necessary
}));
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);


// Socket.IO setup
socketHandler(io);

// Database Sync
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database connected and synced!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
