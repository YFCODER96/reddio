import { Schema, model } from "mongoose";

const userSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  privateKey: {
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
  usedInvitationCode: {
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
  userInfo: {
    type: Object,
    default: null,
  },
});
// 在保存文档之前更新 updated 字段
userSchema.pre("save", function (next) {
  this.updatedAt = new Date(); // 设置 updated 字段为当前时间
  next(); // 继续执行保存操作
});

userSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() }); // 设置 updated 字段为当前时间的 Date 对象
  next();
});

const User = model("User", userSchema);

export default User;
