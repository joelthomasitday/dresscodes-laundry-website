import mongoose, { Schema, Document, Model } from "mongoose";
import { NOTIFICATION_CHANNELS, type NotificationChannel } from "@/lib/constants";

export interface INotification extends Document {
  userId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  channel: NotificationChannel;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    channel: { type: String, enum: NOTIFICATION_CHANNELS, default: "in_app" },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
