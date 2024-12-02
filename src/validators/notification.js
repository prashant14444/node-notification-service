import Joi from "joi";

// Validation schema for notification data
export const notificationSchema = Joi.object({
  senderId: Joi.number().integer().positive().required().messages({
    "number.base": "Sender ID must be a number.",
    "number.integer": "Sender ID must be an integer.",
    "number.positive": "Sender ID must be a positive number.",
    "any.required": "Sender ID is required.",
  }),
  receiverId: Joi.number().integer().positive().required().messages({
    "number.base": "Receiver ID must be a number.",
    "number.integer": "Receiver ID must be an integer.",
    "number.positive": "Receiver ID must be a positive number.",
    "any.required": "Receiver ID is required.",
  }),
  message: Joi.string().max(255).required().messages({
    "string.base": "Message must be a string.",
    "string.max": "Message must not exceed 255 characters.",
    "any.required": "Message is required.",
  }),
  isRead: Joi.boolean().messages({
    "boolean.base": "isRead must be a boolean.",
  })
});
