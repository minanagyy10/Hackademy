import mongoose from "mongoose";

// Attachment sub-schema
const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// Comment sub-schema for discussion thread
const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'comments.authorModel'
  },
  authorModel: {
    type: String,
    required: true,
    enum: ['Student', 'Instructor']
  },
  authorRole: {
    type: String,
    required: true,
    enum: ['student', 'instructor']
  },
  authorName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, "Comment must be at most 2000 characters."]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

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
      required: [true, "Level is required"],
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
    // Legacy single feedback field (kept for backward compatibility)
    feedback: String,
    // New: File attachments for evidence
    attachments: {
      type: [attachmentSchema],
      default: []
    },
    // New: Discussion thread comments
    comments: {
      type: [commentSchema],
      default: []
    },
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

// Index for efficient queries
reportSchema.index({ student: 1, createdAt: -1 });
reportSchema.index({ instructor: 1, createdAt: -1 });

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
