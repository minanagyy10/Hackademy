import mongoose from "mongoose";
import { stringify } from "querystring";

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      lowercase: true,
      trim: true,
      maxlength: [100, "Title must be at most 100 characters long."],
    },
    level: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
     student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Score"
    }
  },
  { timestamps: true }
);

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);