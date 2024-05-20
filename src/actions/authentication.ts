"use server";

import { signIn, signOut } from "@/configs/auth";
import db from "@/configs/db";
import { DEFAULT_REDIRECT_URL } from "@/constants/routes";
import { users } from "@/db/users.schema";
import { getUserByEmail } from "@/db/users.query";
import { generatePasswordResetVerificationToken } from "@/lib/token";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";

export const registerUser = async (user: typeof users.$inferSelect) => {
  const { email, name, password } = user;

  if (!email || !name) return { success: false, message: "Missing fields!" };

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      if (user.id) {
        const newuser = await db
          .update(users)
          .set({
            name: name,
            email: email,
            role: user.role,
          })
          .where(eq(users.id, user.id))
          .returning();

        return { success: true, user: newuser[0] };
      }

      const newuser = await db
        .insert(users)
        .values({
          id: randomUUID(),
          name: name,
          email: email,
          password: hashedPassword,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            name: name,
            email: email,
            password: hashedPassword,
          },
        })
        .returning();

      return { success: true, user: newuser[0] };
    } else {
      const newuser = await db
        .update(users)
        .set({
          name: name,
          email: email,
          role: user.role,
        })
        .where(eq(users.id, user.id))
        .returning();

      return { success: true, user: newuser[0] };
    }
  } catch (error: any) {
    if (error.code === "23505")
      return { success: false, message: "Email Already exists !" };

    return { success: false, message: error.detail ?? error.message };
  }
};

export const signInUser = async (user: Omit<TUser, "name">) => {
  const { email, password } = user;

  if (!email || !password) return "Missing fields!";

  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: DEFAULT_REDIRECT_URL,
    });
  } catch (error: any) {
    if (error.type === "AuthError" && error.kind === "error" && error.cause.err)
      return error.cause.err.message;

    if (
      error.type === "CredentialsSignin" &&
      error.kind === "signIn" &&
      error.code === "credentials"
    )
      return "Invalid Credentials !";

    throw error;
  }
};
export const resetPassword = async (email: string) => {
  if (!email) return "Missing fields!";

  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) return "No user found with this email!";

    const sent = await generatePasswordResetVerificationToken(
      existingUser.name,
      existingUser.email
    );

    if (sent) return "Password reset email sent!";
    else return "Error Occurred!";
  } catch (error: any) {
    return "Error Occurred!";
  }
};

export const signOutUser = async () => {
  try {
    await signOut({
      redirectTo: "/sign-in",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return error.cause.err.message;
      }
      switch (error.type) {
        case "SignOutError":
          return "Something went wrong";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    await db.delete(users).where(eq(users.id, id));
    return true;
  } catch (error) {
    return false;
  }
};

export const getAllUsers = async () => {
  try {
    const usersList = await db.select().from(users);
    return usersList;
  } catch (error) {
    return null;
  }
};

export const getAllUsersName = async () => {
  try {
    const usersList = await db
      .select({
        name: users.name,
      })
      .from(users);
    return usersList;
  } catch (error) {
    return null;
  }
};
