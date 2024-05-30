import {
  boolean,
  doublePrecision,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { shipping } from "./preferences.schema";

export const productCategoryEnum = pgEnum("category_enum", [
  "Books",
  "Home And Gadgets",
  "Health And Beauty",
  "Hot Offer",
  "Baby Products",
  "Alpha Soap",
]);

type TImage = {
  url: string;
  id: string;
};

export const products = pgTable("product", {
  serial: serial("sl"),
  id: uuid("product_id").defaultRandom().primaryKey(),
  name: varchar("product_name", { length: 50 }).notNull().unique(),
  price: doublePrecision("price").notNull(),
  discountPrice: doublePrecision("discount_price").default(0).notNull(),
  discountPercentage: integer("discount_percentage").default(0).notNull(),
  image: json("image").$type<TImage[]>().default([]).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  }).defaultNow(),
  category: varchar("category", { length: 60 })
    .notNull()
    .references(() => categories.category, {
      onDelete: "set null",
    }),
  stock: integer("stock").notNull(),
  quantity: integer("quantity").default(1),
  description: text("description").notNull(),
  status: boolean("product_status").default(true),
});

type TCustomer = {
  name: string;
  phone: string;
  address: string;
  ip?: string;
};

type TProductOrder = Pick<
  typeof products.$inferInsert,
  | "category"
  | "discountPrice"
  | "price"
  | "id"
  | "image"
  | "discountPercentage"
  | "name"
  | "quantity"
  | "stock"
>;

// export const shippingEnum = pgEnum("shipping", [
//   "Inside Dhaka",
//   "Outside Dhaka",
// ]);

export const paymentEnum = pgEnum("payment", [
  "Cash On Delivery",
  "Complete",
  "Bkash",
]);

export const orderStatusEnum = pgEnum("status", [
  "Processing",
  "Delivered",
  "Cancelled",
  "Hold",
  "Pending Payment",
  "Pending Delivery",
]);

export const orders = pgTable("order", {
  serial: serial("sl"),
  id: uuid("id").defaultRandom().primaryKey(),
  invoice: varchar("invoice").notNull().unique(),
  total: doublePrecision("total").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  }).defaultNow(),
  note: text("note"),
  status: orderStatusEnum("status").default("Processing"),
  courier: varchar("courier").references(() => couriers.name),
  shipping: varchar("shipping").references(() => shipping.name),
  payment: paymentEnum("payment").default("Cash On Delivery"),
  products: json("products").$type<TProductOrder[]>().notNull(),
  customer: json("customer").$type<TCustomer>().notNull(),
  count: integer("total_products").notNull(),
  discount: integer("total_discount").default(0),
  delivery: integer("delivery_charge").default(0),
  assigned: varchar("assigned_to"),
  pendingEntry: boolean("pending_entry").default(true),
});

export const categories = pgTable("category", {
  serial: serial("SI"),
  category: varchar("category", { length: 60 }).notNull().unique().primaryKey(),
  status: boolean("category_status").default(true).notNull(),
});

export const sliders = pgTable("slider", {
  serial: serial("SI"),
  id: text("slider_image_id").notNull().unique().primaryKey(),
  image: text("slider_image_url").notNull(),
  status: boolean("slider_status").default(true).notNull(),
});

export const couriers = pgTable("courier", {
  serial: serial("SI"),
  name: varchar("courier_name", { length: 40 }).notNull().unique().primaryKey(),
  charge: integer("courier_charge").notNull().default(0),
  city: boolean("city_available").default(false).notNull(),
  zone: boolean("zone_available").default(false).notNull(),
  status: boolean("courier_status").default(true).notNull(),
});
