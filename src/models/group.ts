import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGroup extends Document {
  _id: string;
  name: string;
  description: string;
  managerId: Types.ObjectId;
  createdAt: Date;
  inviteCode: string;
  scrumTime: string;
  cycle: string;
}

const GroupSchema: Schema = new Schema<IGroup>({
  name: { type: String, required: true },
  managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String },
  inviteCode: { type: String, required: true },
  scrumTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  cycle: { type: String, required: true },
});

export default mongoose.models.Group ||
  mongoose.model<IGroup>("Group", GroupSchema);
