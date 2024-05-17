import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import type { AdapterAccount } from "next-auth/adapters";

export const userRolesEnum = pgEnum("role", ["ADMIN", "STAFF"]);

export const users = pgTable("user", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 40 }).notNull(),
  email: varchar("email", { length: 60 }).notNull().unique(),
  password: varchar("password", { length: 60 }),
  role: userRolesEnum("role").default("STAFF"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    email: varchar("email", { length: 60 })
      .notNull()
      .unique()
      .references(() => users.email, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    passwordResetToken: text("password_reset_token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    passwordResetTokenExpires: timestamp("password_reset_token_expires", {
      mode: "date",
    }),
  },

  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.email, vt.token, vt.passwordResetToken],
    }),
  })
);
