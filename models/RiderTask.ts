import mongoose, { Schema, Document, Model } from "mongoose";
import { TASK_TYPES, TASK_STATUSES, type TaskType, type TaskStatus } from "@/lib/constants";

export interface IRiderTask extends Document {
  riderId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  orderNumber: string;
  type: TaskType;
  status: TaskStatus;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  scheduledTime?: Date;
  completedTime?: Date;
  proofImageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RiderTaskSchema = new Schema<IRiderTask>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    orderNumber: { type: String, required: true },
    type: { type: String, enum: TASK_TYPES, required: true },
    status: { type: String, enum: TASK_STATUSES, default: "assigned" },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    scheduledTime: { type: Date },
    completedTime: { type: Date },
    proofImageUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const RiderTask: Model<IRiderTask> =
  mongoose.models.RiderTask || mongoose.model<IRiderTask>("RiderTask", RiderTaskSchema);
