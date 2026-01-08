import mongoose from "mongoose";

const blackListedTokenSchema = new mongoose.Schema(
  {
    tokenID: {
      type: String,
      required: true,
      unique: true,
    },
    expiredAt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BlackListedTokens = mongoose.models.BlackListedTokens || mongoose.model('BlackListedTokens', blackListedTokenSchema);
export default BlackListedTokens;