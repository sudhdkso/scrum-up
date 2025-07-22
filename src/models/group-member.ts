import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGroupMember extends Document {
  _id: string;
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  role?: string;
  joinedAt?: Date;
}

const GroupMemberSchema: Schema = new Schema<IGroupMember>({
  groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  role: { type: String, default: "member" },
  joinedAt: { type: Date, default: Date.now },
});

export default mongoose.models.GroupMember ||
  mongoose.model<IGroupMember>("GroupMember", GroupMemberSchema);
