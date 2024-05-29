import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { orders } from "@/db/products.schema";

Font.register({
  family: "Noto Sans Bengali",
  src: "https://fonts.gstatic.com/s/notosansbengali/v20/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8BjzVMvJx2mcSPVFpVEqE-6KmsolLudA.ttf",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#E4E4E4",
    paddingHorizontal: "12px",
    paddingVertical: "48px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Noto Sans Bengali",
    fontSize: "12px",
    gap: "12px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    border: "2px",
    borderColor: "black",
    padding: "8px",
    gap: "8px",
    marginBottom: "12px",
    maxWidth: "47%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textBold: { fontWeight: "semibold" },
  image: {
    width: "40px",
    height: "40px",
  },
});

type TReactPdfDoc = Pick<
  typeof orders.$inferSelect,
  | "createdAt"
  | "customer"
  | "total"
  | "shipping"
  | "products"
  | "invoice"
  | "delivery"
  | "discount"
>;

interface IReactPdfDoc {
  data: TReactPdfDoc[];
}

export const ReactPdfDoc = ({ data }: IReactPdfDoc) => (
  <Document>
    <Page size="A3" style={styles.page}>
      {data.map((o) => (
        <View key={o.invoice} style={styles.container}>
          <View style={styles.header}>
            {/* @ts-ignore */}
            <Image style={styles.image} src="/logo.png" alt="logo" />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text style={styles.textBold}>Invoice#{o.invoice}</Text>
              <Text style={styles.textBold}>
                Date: {new Date(o.createdAt!).toLocaleDateString().slice(0, 9)}
              </Text>
            </View>
          </View>
          <View>
            <Text>Name: {o.customer.name}</Text>
            <Text>Phone: {o.customer.phone}</Text>
            <Text>Address: {o.customer.address}</Text>
          </View>

          <View>
            <View
              style={{
                width: "100%",
                border: "2px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  width: "10%",
                  borderRight: "2px",
                  textAlign: "center",
                }}
              >
                SL
              </Text>
              <View
                style={{
                  textAlign: "center",
                  width: "60%",
                  borderRight: "2px",
                }}
              >
                <Text>Item(s)</Text>
              </View>
              <Text
                style={{
                  width: "10%",
                  borderRight: "2px",
                  textAlign: "center",
                }}
              >
                Qty
              </Text>
              <View
                style={{
                  textAlign: "center",
                  width: "20%",
                }}
              >
                <Text>Price</Text>
              </View>
            </View>
            {o.products.map((prod) => {
              return (
                <View
                  key={prod.id}
                  style={{
                    width: "100%",
                    border: "2px",
                    borderTop: "0px",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: "10%",
                      borderRight: "2px",
                      textAlign: "center",
                    }}
                  >
                    1
                  </Text>
                  <View
                    style={{
                      textAlign: "center",
                      width: "60%",
                      borderRight: "2px",
                    }}
                  >
                    <Text>{prod.name}</Text>
                  </View>
                  <Text
                    style={{
                      width: "10%",
                      borderRight: "2px",
                      textAlign: "center",
                    }}
                  >
                    {prod.quantity}
                  </Text>
                  <View
                    style={{
                      textAlign: "center",
                      width: "20%",
                    }}
                  >
                    <Text>
                      {prod.discountPrice ? prod.discountPrice : prod.price}
                    </Text>
                  </View>
                </View>
              );
            })}
            <View
              style={{
                width: "100%",
                textAlign: "right",
                border: "2px",
                borderTop: "0px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  width: "80%",
                  borderRight: "2px",
                  paddingRight: "8px",
                }}
              >
                SubTotal
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                }}
              >
                {o.products.reduce((acc, p) => acc + p.price * p.quantity!, 0)}
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                textAlign: "right",
                border: "2px",
                borderTop: "0px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  width: "80%",
                  borderRight: "2px",
                  paddingRight: "8px",
                }}
              >
                Discount (-)
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                }}
              >
                {o.discount}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                textAlign: "right",
                border: "2px",
                borderTop: "0px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  width: "80%",
                  borderRight: "2px",
                  paddingRight: "8px",
                }}
              >
                Delivery Cost (+)
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                }}
              >
                {o.delivery}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  width: "80%",
                  textAlign: "right",
                  paddingRight: "8px",
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  width: "20%",
                  textAlign: "center",
                }}
              >
                {o.total}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);
