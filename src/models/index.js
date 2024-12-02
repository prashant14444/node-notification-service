import { Sequelize } from "sequelize";
import User from "./user.js";
import Notification from "./notification.js";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

// Initialize models
const models = {
  User: User(sequelize),
  Notification: Notification(sequelize),
};

// Set up associations
models.User.hasMany(models.Notification, { foreignKey: "senderId" });
models.User.hasMany(models.Notification, { foreignKey: "receiverId" });
models.Notification.belongsTo(models.User, { as: "Sender", foreignKey: "senderId" });
models.Notification.belongsTo(models.User, { as: "Receiver", foreignKey: "receiverId" });

export { sequelize, models };
