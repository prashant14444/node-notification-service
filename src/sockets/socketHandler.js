const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("registerUser", (userId) => { // Register the user by their userId
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket id: ${socket.id}`);
    });

    // Sending notification to the receiver if they are online
    socket.on("sendNotification", ({ senderId, receiverId, message }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        // Emit the notification to the receiver
        io.to(receiverSocket).emit("receiveNotification", {
          senderId,
          message,
        });
      } else {
        console.log(`Receiver ${receiverId} is offline, storing notification.`);
        // Handle offline notification (e.g., store in database for later retrieval)
        // To do Task, the data is already in the database. 
      }
    });

    // Handle disconnection and cleanup the user from the map
    socket.on("disconnect", () => {
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
          console.log(
            `User ${key} disconnected and removed from online users.`
          );
        }
      });
    });
  });
};

export { onlineUsers };
export default socketHandler;
