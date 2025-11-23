import mongoose, { Document, Schema } from "mongoose";

// Define the session interface
export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  role: string;
  experience: string;
  topicsToFocus: string;
  description?: string;
  questions: mongoose.Types.ObjectId[];
}

// Define schema
const SessionSchema = new Schema<ISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    topicsToFocus: { type: String, required: true },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

// Export model
const Session = mongoose.model<ISession>("Session", SessionSchema);
export default Session;
