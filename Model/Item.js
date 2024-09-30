import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
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
