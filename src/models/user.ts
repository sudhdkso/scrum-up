import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name?: string;
  email: string;
  kakaoId?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  kakaoId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
