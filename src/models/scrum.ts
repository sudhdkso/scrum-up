import mongoose, { Schema, Document, Types } from "mongoose";

export interface IScrum extends Document {
  _id: string;
  userId: string;
  groupId: string;
  date: Date;
  answer: string[];
}

const ScrumSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  answer: {
    type: [String],
    required: true,
  },
});

export default mongoose.models.Scrum ||
  mongoose.model<IScrum>("Scrum", ScrumSchema);
