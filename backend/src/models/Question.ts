import mongoose, { Document, Schema } from "mongoose";

// Define the question interface
export interface IQuestion extends Document {
  session: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  notes?: string;
  isPinned: boolean;
}

// Define schema
const QuestionSchema = new Schema<IQuestion>(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    notes: { type: String },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Export model
const Question = mongoose.model<IQuestion>("Question", QuestionSchema);
export default Question;
