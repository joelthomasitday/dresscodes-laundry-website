import mongoose, { Schema, Document, Model } from "mongoose";
import { INVOICE_STATUSES, type InvoiceStatus } from "@/lib/constants";

export interface IInvoiceItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  orderId?: mongoose.Types.ObjectId;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  pdfUrl?: string;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    items: [InvoiceItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    pdfUrl: { type: String },
    status: { type: String, enum: INVOICE_STATUSES, default: "draft" },
  },
  { timestamps: true }
);

// Auto-generate invoice number
InvoiceSchema.pre("save", async function () {
  if (this.isNew && !this.invoiceNumber) {
    try {
      const InvoiceModel = this.constructor as Model<IInvoice>;
      const count = await InvoiceModel.countDocuments();
      this.invoiceNumber = `INV-${String(count + 1001).padStart(6, "0")}`;
    } catch (err) {
      console.error("Invoice number generation error:", err);
      // Fallback
      this.invoiceNumber = `INV-${Date.now()}`;
    }
  }
});

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
