import mongoose from "mongoose";
import { systemRoles } from "../../constants/constants.js";
import { genderEnum } from "../../constants/constants.js";
import { providersEnum } from "../../constants/constants.js";
import { stringify } from "querystring";

const studentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      lowercase: true,
      trim: true,
      unique: true,
      minlength: [5, "Username must be at least 5 characters long."],
      maxlength: [20, "Username must be at most 20 characters long."],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already taken"],
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [13, "You must be at least 13 years old"],
      match: /^\d{10}$/,
    },
    isDeactivated: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: systemRoles.USER,
      enum: Object.values(systemRoles),
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: Object.values(genderEnum),
      default: genderEnum.NOT_SPECIFIED,
    },
    provider: {
      type: String,
      default: providersEnum.SYSTEM,
      enum: Object.values(providersEnum),
    },
    profilePicture: String,
    reports: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report"
    }],
    scores: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Score"
    }],
    totalScore: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);