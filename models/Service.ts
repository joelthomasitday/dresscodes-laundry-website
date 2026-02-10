import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string; // 'kg', 'piece', 'pair', etc.
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true, default: "piece" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
