import { Schema, model } from "mongoose";

const userSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  isTwitterAuth: {
    type: Boolean,
    default: false,
  },
  twitterBindedBrowserSeq: {
    type: Number,
    default: 0,
  },
  ipProxy: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  invitationCode: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  remark: {
    type: String,
    default: "",
  },
});

const User = model("User", userSchema);

export default User;
