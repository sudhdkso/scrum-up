import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name?: string;
  email: string;
  kakaoId?: string;
  createdAt: Date;
  isNotificationOn: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  kakaoId: { type: String },
  createdAt: { type: Date, default: Date.now },
  isNotificationOn: { type: Boolean, default: true },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
