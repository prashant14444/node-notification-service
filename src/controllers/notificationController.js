import { StatusCodes } from "http-status-codes";
import { models } from "../models/index.js";
import { notificationSchema } from "../validators/notification.js";
import { onlineUsers } from "../sockets/socketHandler.js";

const { Notification, User } = models;

export const sendNotification = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const { error } = notificationSchema.validate(req.body);
    if (error?.details) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.details[0].message });
    } else {
      const notification = await Notification.create({
        senderId,
        receiverId,
        message,
      });

      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        // Check if the receiver is online
        // If online then send the notification in real-time via Socket.IO
        io.to(receiverSocket).emit("receiveNotification", {
          senderId,
          message,
        });
      }
      res.status(201).json({ notification });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const getNotifications = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  try {
    const offset = (page - 1) * limit;

    // Fetch notifications with pagination
    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: { receiverId: userId },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    // Respond with the notifications and pagination metadata
    res.status(StatusCodes.OK).json({
      notifications,
      total: count,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findOne({ where: { id } });
    if (!notification) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Notification does not exist" });
    } else {
      await Notification.update({ isRead: true }, { where: { id } });
      res
        .status(StatusCodes.OK)
        .json({ message: "Notification marked as read" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;

  try {
    // Update all notifications for the user to marked as read
    const [updated] = await Notification.update(
      { isRead: true },
      { where: { receiverId: userId, isRead: false } }
    );

    if (updated) {
      res
        .status(StatusCodes.OK)
        .json({ message: "All notifications marked as read" });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No unread notifications found" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
