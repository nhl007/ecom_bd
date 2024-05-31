import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres({
  port: Number(process.env.DB_PORT!),
  host: process.env.DB_HOST!,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME!,
});

const db = drizzle(queryClient);

export default db;
