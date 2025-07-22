import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInviteCode extends Document {
  _id: string;
  code: string;
  groupId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
}

const InviteCodeSchema = new Schema<IInviteCode>({
  code: { type: String, required: true },
  groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3일 뒤 만료
  },
});

InviteCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); //만료시 삭제

export default mongoose.models.InviteCode ||
  mongoose.model<IInviteCode>("InviteCode", InviteCodeSchema);
