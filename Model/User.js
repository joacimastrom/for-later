import mongoose from "mongoose";
import { Item } from "./Item";

const User = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email is invalid"],
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    items: [Item],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", User);
