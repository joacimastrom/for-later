import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
});

export const Item = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    files: [FileSchema],
  },
  {
    timestamps: true,
  }
);

export default Item;
