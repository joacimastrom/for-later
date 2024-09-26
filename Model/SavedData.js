import mongoose from "mongoose";

export const SavedData = mongoose.Schema(
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

export default SavedData;
