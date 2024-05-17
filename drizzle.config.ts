import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  schema: "./src/db/*.schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME!,
    ssl: true,
  },
};
