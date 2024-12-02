import express from "express";
import {
  sendNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authenticate, sendNotification);
router.get("/", authenticate, getNotifications);
router.put("/:id/read", authenticate, markNotificationAsRead);
router.put("/mark-all-read", authenticate, markAllNotificationsAsRead);

export default router;
