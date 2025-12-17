import mongoose, { Schema, model, models } from "mongoose";

export interface ITransaction {
  lenderId: mongoose.Types.ObjectId;
  borrowerId: mongoose.Types.ObjectId;
  componentId: mongoose.Types.ObjectId;
  status: "PENDING" | "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  startDate?: Date;
  endDate?: Date;
  lenderRating?: number;
  borrowerRating?: number;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    lenderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    borrowerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    componentId: { type: Schema.Types.ObjectId, ref: "Component", required: true },
    status: { 
      type: String, 
      enum: ["PENDING", "APPROVED", "ACTIVE", "COMPLETED", "CANCELLED"], 
      default: "PENDING" 
    },
    startDate: { type: Date },
    endDate: { type: Date },
    lenderRating: { type: Number, min: 1, max: 5 },
    borrowerRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

const Transaction = models.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;