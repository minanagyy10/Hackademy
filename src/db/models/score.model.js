import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
      unique: true
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    reviewedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const Score = mongoose.models.Score || mongoose.model("Score", scoreSchema);