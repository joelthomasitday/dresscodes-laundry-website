import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: "40pt 50pt",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 20,
  },
  brandSection: {
    flexDirection: "column",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#059669", // Emerald 600
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 8,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  invoiceTitleSection: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 900,
    color: "#111827",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#6B7280",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoBlock: {
    width: "45%",
  },
  infoLabel: {
    fontSize: 8,
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D1D5DB",
    paddingBottom: 2,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  table: {
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    padding: 8,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 10,
  },
  descCell: { width: "50%" },
  qtyCell: { width: "15%", textAlign: "center" },
  rateCell: { width: "15%", textAlign: "right" },
  totalCell: { width: "20%", textAlign: "right" },
  
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  totalsBox: {
    width: "200pt",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#111827",
  },
  totalLabel: {
    fontSize: 10,
    color: "#374151",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
    paddingTop: 15,
    textAlign: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  notes: {
    marginTop: 40,
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
    color: "#374151",
  },
  notesText: {
    fontSize: 8,
    color: "#6B7280",
    lineHeight: 1.4,
  },
  qualityBadge: {
    position: "absolute",
    top: 150,
    right: 50,
    transform: "rotate(15deg)",
    borderWidth: 1,
    borderColor: "#059669", // green
    borderStyle: "dashed",
    padding: 6,
    borderRadius: 4,
    opacity: 0.3,
  },
  qualityText: {
    fontSize: 8,
    color: "#059669",
    fontWeight: "bold",
    textTransform: "uppercase",
  }
});
