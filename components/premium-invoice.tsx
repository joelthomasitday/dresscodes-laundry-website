"use client";

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { styles } from "./invoice-styles";

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

export const PremiumInvoicePDF = ({ data }: { data: InvoiceData }) => (
  <Document title={`Invoice ${data.invoiceNumber}`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandSection}>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={[styles.logo, { textTransform: "lowercase" }]}>dresscode</Text>
            <Text style={[styles.logo, { color: "#111827", marginLeft: 4, fontSize: 18 }]}>laundry</Text>
          </View>
          <Text style={styles.tagline}>Drop the laundry, not your plans</Text>
        </View>
        <View style={styles.invoiceTitleSection}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>#{data.invoiceNumber}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Bill To</Text>
          <Text style={[styles.infoText, { fontWeight: "bold" }]}>{data.customerName}</Text>
          <Text style={styles.infoText}>{data.customerPhone}</Text>
          {data.customerAddress && <Text style={styles.infoText}>{data.customerAddress}</Text>}
        </View>
        <View style={styles.infoBlock}>
          <Text style={[styles.infoLabel, { textAlign: "right" }]}>Details</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Text style={[styles.infoText, { color: "#6B7280" }]}>Date: </Text>
            <Text style={styles.infoText}>{data.date}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Text style={[styles.infoText, { color: "#6B7280" }]}>Status: </Text>
            <Text style={[styles.infoText, { color: "#059669" }]}>PAYMENT RECEIVED</Text>
          </View>
        </View>
      </View>

      {/* Main Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.descCell}><Text style={styles.tableHeaderCell}>Service Description</Text></View>
          <View style={styles.qtyCell}><Text style={styles.tableHeaderCell}>Qty</Text></View>
          <View style={styles.rateCell}><Text style={styles.tableHeaderCell}>Rate</Text></View>
          <View style={styles.totalCell}><Text style={styles.tableHeaderCell}>Total</Text></View>
        </View>
        
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.descCell}><Text style={styles.tableCell}>{item.name}</Text></View>
            <View style={styles.qtyCell}><Text style={styles.tableCell}>{item.qty}</Text></View>
            <View style={styles.rateCell}><Text style={styles.tableCell}>₹{item.price.toFixed(2)}</Text></View>
            <View style={styles.totalCell}><Text style={styles.tableCell}>₹{item.total.toFixed(2)}</Text></View>
          </View>
        ))}
      </View>

      {/* Totals Section */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₹{data.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>GST (18%)</Text>
            <Text style={styles.totalValue}>₹{data.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{data.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      {data.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes & Terms</Text>
          <Text style={styles.notesText}>{data.notes}</Text>
        </View>
      )}

      {/* Quality Badge */}
      <View style={styles.qualityBadge}>
        <Text style={styles.qualityText}>Quality Inspected</Text>
        <Text style={[styles.qualityText, { fontSize: 6, textAlign: "center", marginTop: 2 }]}>Hand Handled</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>dresscode laundry - Professional Garment Care</Text>
        <Text style={styles.footerText}>Kottayam, Kerala</Text>
        <Text style={[styles.footerText, { color: "#10b981", marginTop: 2 }]}>+91 89 4343 7272 • www.dresscodes.in</Text>
      </View>
    </Page>
  </Document>
);

export default function PremiumInvoice({ data }: { data: InvoiceData }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="w-full max-w-4xl h-[800px] border rounded-xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm p-4">
        <PDFViewer width="100%" height="100%" showToolbar={false} className="rounded-lg border shadow-inner">
          <PremiumInvoicePDF data={data} />
        </PDFViewer>
      </div>
      
      <div className="flex gap-4">
        <PDFDownloadLink
          document={<PremiumInvoicePDF data={data} />}
          fileName={`invoice-${data.invoiceNumber}.pdf`}
          className="no-underline"
        >
          {({ loading }) => (
            <button
              disabled={loading}
              className={`
                px-8 py-3 rounded-full font-bold text-white transition-all transform active:scale-95
                ${loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30"}
              `}
            >
              {loading ? "Generating..." : "Download Premium Invoice"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
