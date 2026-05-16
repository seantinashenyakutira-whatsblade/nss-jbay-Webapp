import { Document, Page, Text, View, StyleSheet, Font, DocumentProps } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGyYMZg.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Inter", fontSize: 10 },
  header: { marginBottom: 30, borderBottom: 2, borderColor: "#D4006A", paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: "#D4006A", marginBottom: 5 },
  subtitle: { fontSize: 12, color: "#6b6560" },
  company: { fontSize: 14, fontWeight: 700, marginBottom: 5 },
  address: { fontSize: 10, color: "#6b6560", lineHeight: 1.5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: "#D4006A", marginBottom: 10, textTransform: "uppercase" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottom: 1, borderColor: "#2a2a2a" },
  label: { color: "#6b6560", width: "40%" },
  value: { width: "60%", textAlign: "right" },
  total: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, marginTop: 10, borderTop: 2, borderColor: "#D4006A" },
  totalLabel: { fontSize: 14, fontWeight: 700 },
  totalValue: { fontSize: 14, fontWeight: 700, color: "#D4006A" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, textAlign: "center", color: "#6b6560", fontSize: 8 },
});

export interface InvoiceData {
  reference: string;
  date: string;
  customerName: string;
  customerEmail: string;
  unitName: string;
  unitSize: string;
  startDate: string;
  endDate: string;
  duration: number;
  monthlyRate: number;
  discount: number;
  total: number;
  paymentReference: string;
  paymentDate: string;
  paymentMethod: string;
}

interface InvoiceDocumentProps extends DocumentProps {
  data: InvoiceData;
}

export function InvoiceDocument({ data }: InvoiceDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>National Secure Storage — Jeffrey's Bay</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 30 }}>
          <View>
            <Text style={styles.company}>National Secure Storage</Text>
            <Text style={styles.address}>35 St Croix Street</Text>
            <Text style={styles.address}>Jeffrey's Bay, Eastern Cape, 6330</Text>
            <Text style={styles.address}>info@nss-jbay.co.za</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 10, color: "#6b6560" }}>Invoice Date</Text>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>{data.date}</Text>
            <Text style={{ fontSize: 10, color: "#6b6560", marginTop: 5 }}>Reference</Text>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>{data.reference}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={{ fontSize: 12, fontWeight: 700 }}>{data.customerName}</Text>
          <Text style={{ fontSize: 10, color: "#6b6560" }}>{data.customerEmail}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage Unit Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Unit</Text>
            <Text style={styles.value}>{data.unitName} ({data.unitSize})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rental Period</Text>
            <Text style={styles.value}>{data.startDate} to {data.endDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{data.duration} Month{data.duration > 1 ? "s" : ""}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Rate (×{data.duration})</Text>
            <Text style={styles.value}>R {(data.monthlyRate * data.duration).toLocaleString("en-ZA")}</Text>
          </View>
          {data.discount > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Discount</Text>
              <Text style={{ ...styles.value, color: "#22c55e" }}>-R {data.discount.toLocaleString("en-ZA")}</Text>
            </View>
          )}
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>R {data.total.toLocaleString("en-ZA")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Reference</Text>
            <Text style={styles.value}>{data.paymentReference}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date</Text>
            <Text style={styles.value}>{data.paymentDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{data.paymentMethod}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={{ ...styles.value, color: "#22c55e", fontWeight: 700 }}>COMPLETED</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for choosing National Secure Storage. For inquiries, contact info@nss-jbay.co.za
        </Text>
      </Page>
    </Document>
  );
}
