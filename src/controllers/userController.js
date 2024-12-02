import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { models } from "../models/index.js";
import {userSchema} from "../validators/user.js"
import { StatusCodes } from "http-status-codes";

const { User } = models;

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const {error} = userSchema.validate(req.body);

    if(error?.details){
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(StatusCodes.CREATED).json({ message: "User registered successfully", userId: user.id });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Username already exists."});
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
