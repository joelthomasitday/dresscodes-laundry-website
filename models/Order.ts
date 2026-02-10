import mongoose, { Schema, Document, Model } from "mongoose";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/constants";

export interface IOrderItem {
  serviceId?: string;
  name: string;
  quantity: number;
  weight?: number;
  price: number;
}

export interface IStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  updatedBy?: string;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  services: IOrderItem[];
  status: OrderStatus;
  pickupDate: Date;
  pickupTimeSlot: string;
  deliveryDate?: Date;
  assignedStaff?: mongoose.Types.ObjectId;
  assignedRider?: mongoose.Types.ObjectId;
  totalAmount: number;
  notes?: string;
  statusHistory: IStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    serviceId: { type: String },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    weight: { type: Number },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: String },
    note: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true },
      address: { type: String, required: true, trim: true },
    },
    services: [OrderItemSchema],
    status: { type: String, enum: ORDER_STATUSES, default: "CREATED" },
    pickupDate: { type: Date, required: true },
    pickupTimeSlot: { type: String, required: true },
    deliveryDate: { type: Date },
    assignedStaff: { type: Schema.Types.ObjectId, ref: "User" },
    assignedRider: { type: Schema.Types.ObjectId, ref: "User" },
    totalAmount: { type: Number, default: 0 },
    notes: { type: String },
    statusHistory: [StatusHistorySchema],
  },
  { timestamps: true }
);

// Auto-generate order number before save
OrderSchema.pre("save", async function () {
  if (this.isNew && !this.orderNumber) {
    try {
      // Use this.constructor to refer to the model to avoid circular dependency or undefined references
      const OrderModel = this.constructor as mongoose.Model<IOrder>;
      const count = await OrderModel.countDocuments();
      this.orderNumber = `DC-${String(count + 1001).padStart(6, "0")}`;
    } catch (err) {
      console.error("Order number generation error:", err);
      // Fallback to a timestamp based ID to ensure uniqueness and prevent save failure
      this.orderNumber = `DC-TMP-${Date.now()}`;
    }
  }
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Order;
}

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
