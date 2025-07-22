import mongoose, { Schema, Document, Types } from "mongoose";

export interface IScrum extends Document {
  _id: string;
  userId: Types.ObjectId;
  groupId: Types.ObjectId;
  date: Date;
  questions: string[];
  answers: string[];
}

const ScrumSchema: Schema = new Schema<IScrum>({
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
  questions: {
    type: [String],
    required: true,
  },
  answers: {
    type: [String],
    required: true,
  },
});

export default mongoose.models.Scrum ||
  mongoose.model<IScrum>("Scrum", ScrumSchema);
