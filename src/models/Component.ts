import mongoose, { Schema, model, models } from "mongoose";

export interface IComponent {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: "GIVE" | "TAKE";
  category: string;
  condition?: "NEW" | "USED" | "DAMAGED";
  description: string;
  imageUrl?: string;
  status: "AVAILABLE" | "BORROWED" | "SOLD"; // Added BORROWED
}

const ComponentSchema = new Schema<IComponent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["GIVE", "TAKE"], required: true },
    category: { type: String, required: true },
    condition: { type: String, enum: ["NEW", "USED", "DAMAGED"] },
    description: { type: String, required: true },
    imageUrl: { type: String },
    status: { 
      type: String, 
      enum: ["AVAILABLE", "BORROWED", "SOLD"], 
      default: "AVAILABLE" 
    },
  },
  { timestamps: true }
);

const Component = models.Component || model<IComponent>("Component", ComponentSchema);

export default Component;