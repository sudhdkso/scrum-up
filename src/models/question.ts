import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuestion extends Document {
  _id: string;
  questionTexts: string[];
  groupId: string;
  creatorId: string;
  role?: string;
  createdAt?: Date;
}

const QuestionSchema = new Schema({
  questionTexts: {
    type: [String],
    required: true,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);
