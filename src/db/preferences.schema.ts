import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const preferences = pgTable("preference", {
  id: uuid("id").defaultRandom().primaryKey(),
  pixelScript: text("pixel_script").default(""),
  address: text("address").notNull(),
  phone: varchar("phone")
    .$default(() => "09649809080")
    .notNull(),
});

export const shipping = pgTable("shipping_methods", {
  serial: serial("SI"),
  name: varchar("name").notNull().unique().primaryKey(),
  cost: integer("cost").notNull(),
  status: boolean("status")
    .$default(() => true)
    .notNull(),
});
