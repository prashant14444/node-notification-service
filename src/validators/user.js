import Joi from "joi";

// Validation schema for user data
export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "Username must only contain letters and numbers.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username must not exceed 30 characters.",
    "any.required": "Username is required.",
  }),
  password: Joi.string().min(4).max(255).required().messages({
    "string.min": "Password must be at least 4 characters long.",
    "string.max": "Password must not exceed 255 characters.",
    "any.required": "Password is required.",
  }),
});
