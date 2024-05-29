import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

type TImage = {
  url: string;
  id: string;
};

export const preferences = pgTable("preference", {
  id: uuid("id").defaultRandom().primaryKey(),
  pixelScript: text("pixel_script").default(""),
  address: text("address").notNull(),
  copyRight: text("copy_right").notNull(),
  logo: json("logo")
    .$type<TImage>()
    .default({
      id: "",
      url: "",
    })
    .notNull(),
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
