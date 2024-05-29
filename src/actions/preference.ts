"use server";
import db from "@/configs/db";
import { preferences, shipping } from "@/db/preferences.schema";
import { eq } from "drizzle-orm";
import { revalidateTag, unstable_cache as cache } from "next/cache";

//!preference

export const setPreferences = async (data: typeof preferences.$inferInsert) => {
  try {
    const exists = await db
      .select({ id: preferences.id })
      .from(preferences)
      .limit(1);

    if (exists.length) {
      await db
        .update(preferences)
        .set({
          ...data,
        })
        .where(eq(preferences.id, exists[0].id));

      revalidateTag("preference");
      revalidateTag("pixel_code");

      return true;
    }

    await db.insert(preferences).values(data);

    revalidateTag("preference");
    revalidateTag("pixel_code");

    return true;
  } catch (error) {
    return false;
  }
};

export const getPixelCode = cache(
  async () => {
    try {
      const code = await db
        .select({ code: preferences.pixelScript })
        .from(preferences);

      if (!code.length) return "";

      return code[0].code;
    } catch (error) {
      return "";
    }
  },
  ["get-pixel-code"],
  {
    tags: ["pixel_code"],
  }
);

export const getPreferences = cache(
  async () => {
    try {
      const code = await db
        .select({
          phone: preferences.phone,
          address: preferences.address,
          logo: preferences.logo,
          copyright: preferences.copyRight,
        })
        .from(preferences);

      return code[0];
    } catch (error) {
      return null;
    }
  },
  ["get-preference"],
  {
    tags: ["preference"],
  }
);

export const insertNewShipping = async (data: typeof shipping.$inferInsert) => {
  try {
    const cat = await db
      .insert(shipping)
      .values(data)
      .onConflictDoUpdate({
        target: shipping.name,
        set: { cost: data.cost, name: data.name },
      })
      .returning();

    revalidateTag("shipping");
    return cat[0];
  } catch (error) {
    return null;
  }
};

export const getAllShipping = cache(
  async (status?: boolean) => {
    try {
      const cat = db
        .select()
        .from(shipping)
        .orderBy(shipping.serial)
        .where(status === undefined ? undefined : eq(shipping.status, status));

      return cat;
    } catch (error) {
      return null;
    }
  },
  ["get-all-shipping"],
  {
    tags: ["shipping"],
  }
);

export const deleteShipping = async (name: string) => {
  try {
    await db.delete(shipping).where(eq(shipping.name, name));
    revalidateTag("shipping");
    return true;
  } catch (error) {
    return false;
  }
};
