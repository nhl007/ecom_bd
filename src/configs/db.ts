import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.NEON_DATABASE_URL!);
const db = drizzle(sql);

export default db;

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Client } from "pg";

// const client = new Client({
//   port: Number(process.env.DB_PORT!),
//   host: process.env.DB_HOST!,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME!,
//   // ssl: true,
// });

// client
//   .connect()
//   .then((data) => console.log("connected to db!"))
//   .catch((e) => {
//     console.log("db connection error!", e);
//   });

// const db = drizzle(client);

// export default db;
