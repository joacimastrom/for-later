import mongoose from "mongoose";

export const Item = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Item;
