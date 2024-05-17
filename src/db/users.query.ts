import db from "@/configs/db";
import { users, verificationTokens } from "./users.schema";
import { sql } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email}`);

    return user[0];
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db
      .select({
        name: users.name,
        id: users.id,
        email: users.email,
        role: users.role,
        image: users.image,
        verified: users.emailVerified,
      })
      .from(users)
      .where(sql`${users.id} = ${id}`);

    return user[0];
  } catch (error) {
    return null;
  }
};

export const getExistingVerificationToken = async (email: string) => {
  try {
    const token = await db
      .select()
      .from(verificationTokens)
      .where(sql`${verificationTokens.email} = ${email}`);
    return token[0];
  } catch (error) {
    return null;
  }
};
