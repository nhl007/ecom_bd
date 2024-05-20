"use server";

import db from "@/configs/db";
import {
  products,
  orders,
  categories,
  couriers,
  sliders,
} from "@/db/products.schema";
import { and, desc, eq, gte, ilike, isNull, sql } from "drizzle-orm";
import {
  unstable_noStore as noStore,
  unstable_cache as cache,
  revalidateTag,
  revalidatePath,
} from "next/cache";
import { uploadImage } from "./cloudinary";

export const getProductsById = cache(
  async (id: string) => {
    try {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, id));
      return product[0];
    } catch (error) {
      return null;
    }
  },
  ["get-products-by-id"],
  {
    tags: ["ind-product", "products"],
  }
);

export const createNewProducts = async (data: typeof products.$inferInsert) => {
  try {
    await db.insert(products).values(data);
    revalidateTag("products");
    revalidateTag("dashboard");

    return { success: true, message: "Successfully created a new product !" };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const updateProduct = async (data: typeof products.$inferInsert) => {
  try {
    await db
      .update(products)
      .set({
        category: data.category,
        description: data.description,
        discountPercentage: data.discountPercentage,
        discountPrice: data.discountPrice,
        stock: data.stock,
        price: data.price,
        image: data.image,
        name: data.name,
        status: data.status,
      })
      .where(eq(products.id, data.id!));
    revalidateTag("products");

    return { success: true, message: "Successfully updated !" };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidateTag("products");
    revalidateTag("dashboard");
    return { success: true, message: "Successfully deleted product !" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * @param @limit -> How many product to fetch
 * @param @page -> Page
 */

export const getProducts = cache(
  async (status?: boolean, limit?: number, page?: number) => {
    const skip = ((page ? page : 1) - 1) * (limit ? limit : 20);
    const product = await db
      .select()
      .from(products)
      .where(!status ? undefined : eq(products.status, status))
      .offset(skip);
    if (!product.length) return null;

    return product;
  },
  ["get-products"],
  {
    tags: ["products"],
  }
);

export const createNewOrder = async (data: typeof orders.$inferInsert) => {
  try {
    const prev = await db
      .select({ serial: orders.serial })
      .from(orders)
      .orderBy(desc(orders.serial))
      .limit(1);

    const sku = "INV" + (prev.length ? prev[0].serial + 1 : "1");

    const order = await db
      .insert(orders)
      .values({ ...data, invoice: sku })
      .returning({ id: orders.id });

    data.products.forEach((element) => {
      db.update(products)
        .set({
          quantity: sql`${products.quantity} - ${element.quantity}`,
        })
        .where(eq(products.id, element.id!));
    });

    revalidateTag("orders");
    revalidateTag("ind-product");
    revalidateTag("dashboard");
    return { success: true, message: order[0].id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateOrderById = async (
  id: string,
  data: typeof orders.$inferInsert
) => {
  try {
    const order = await db
      .update(orders)
      .set(data)
      .where(eq(orders.id, id))
      .returning({ id: orders.id });

    revalidateTag("orders");
    revalidateTag("dashboard");
    return { success: true, message: order[0].id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteOrderById = async (id: string) => {
  try {
    await db.delete(orders).where(eq(orders.id, id));
    revalidateTag("orders");
    revalidateTag("dashboard");
    return true;
  } catch (error) {
    return false;
  }
};

export const getOrders = cache(
  async (limit?: number, page?: number) => {
    try {
      const skip = ((page ? page : 1) - 1) * (limit ? limit : 20);
      const order = await db
        .select()
        .from(orders)
        .offset(skip)
        .orderBy(desc(orders.createdAt));
      if (order.length) return order;
      return null;
    } catch (error) {
      return null;
    }
  },
  ["get-orders"],
  {
    tags: ["orders"],
  }
);

export const filterOrders = cache(
  async (query: {
    courier?: string | null;
    status?:
      | "Delivered"
      | "Pending Payment"
      | "Cancelled"
      | "Processing"
      | null;
    phone?: string | null;
    pendingEntry?: boolean;
  }) => {
    try {
      const order = await db
        .select()
        .from(orders)
        .where(
          and(
            query.courier ? eq(orders.courier, query.courier) : undefined,
            query.status ? eq(orders.status, query.status) : undefined,
            query.phone ? sql`customer->>'phone' = ${query.phone}` : undefined,
            query.pendingEntry ? isNull(orders.courier) : undefined
          )
        )
        .orderBy(desc(orders.createdAt));
      if (order.length) return order;
      return null;
    } catch (error) {
      return null;
    }
  },
  ["get-orders"],
  {
    tags: ["orders"],
  }
);

export const getLastTenOrders = cache(
  async () => {
    try {
      const res = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(10);
      return res;
    } catch (error) {
      return null;
    }
  },
  ["get-last-ten"],
  {
    tags: ["orders"],
    revalidate: 3600 * 24,
  }
);

export const getOrderById = cache(
  async (id: string) => {
    try {
      const order = await db.select().from(orders).where(eq(orders.id, id));
      if (!order.length) return null;

      return order[0];
    } catch (error) {
      return null;
    }
  },
  ["get-order-id"],
  {
    tags: ["orders", "ind-order"],
  }
);

export const updateOrder = async (data: typeof orders.$inferInsert) => {
  try {
    await db
      .update(orders)
      .set({
        courier: data.courier,
        status: data.status,
        customer: data.customer,
        shipping: data.shipping,
        products: data.products,
        assigned: data.assigned,
      })
      .where(eq(orders.id, data.id as string));

    revalidateTag("orders");
    revalidateTag("dashboard");
    return { success: true, message: "Order updated" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getProductsByCategory = cache(
  async (
    cat: typeof products.$inferSelect.category,
    limit?: number,
    page?: number
  ) => {
    try {
      const skip = ((page ? page : 1) - 1) * (limit ? limit : 10);
      const product = await db
        .select()
        .from(products)
        .where(and(eq(products.status, true), eq(products.category, cat)))
        .offset(skip);

      if (!product.length) return null;
      return product;
    } catch (error) {
      return null;
    }
  },
  ["get-products-by-category"],
  {
    tags: ["products", "category"],
  }
);

export const getProductsByName = async (name: string) => {
  try {
    const product = await db
      .select()
      .from(products)
      .where(and(eq(products.status, true), ilike(products.name, `%${name}%`)));

    if (!product.length) return null;
    return product;
  } catch (error) {
    return null;
  }
};

export const getAllCustomers = cache(
  async () => {
    try {
      const customer = await db
        .select({
          customer: orders.customer,
          id: orders.id,
          createdAt: orders.createdAt,
          note: orders.note,
        })
        .from(orders);

      if (!customer.length) return null;
      return customer;
    } catch (error) {
      return null;
    }
  },
  ["customer-info"],
  {
    tags: ["orders", "customer"],
  }
);

export const getDashBoardData = cache(
  async () => {
    const dashboard = {
      "Total Revenue": 0,
      "Total Staff": 0,
      "Total Customer": 0,
      "Total Product": 0,
      "Total Order": 0,
      "Total Cancelled": 0,
      "Total Completed": 0,
      "Total Processing": 0,
      "Total Pending Payment": 0,
      "Total Hold": 0,
      "Total Pending Delivery": 0,
      "Total Pending Entry": 0,
    };

    try {
      const totalProducts = await db
        .select({
          id: products.id,
        })
        .from(products);

      const orderDetails = await db.select().from(orders);

      orderDetails.forEach((order) => {
        // !total
        dashboard["Total Revenue"] = dashboard["Total Revenue"] + order.total;

        if (!order.courier) {
          dashboard["Total Pending Entry"] =
            dashboard["Total Pending Entry"] + 1;
        }

        //!order status
        if (order.status && order.status === "Delivered") {
          dashboard["Total Completed"] = dashboard["Total Completed"] + 1;
        } else if (order.status && order.status === "Processing") {
          dashboard["Total Processing"] = dashboard["Total Processing"] + 1;
        } else if (order.status && order.status === "Cancelled") {
          dashboard["Total Cancelled"] = dashboard["Total Cancelled"] + 1;
        } else if (order.status && order.status === "Hold") {
          dashboard["Total Hold"] = dashboard["Total Hold"] + 1;
        } else if (order.status && order.status === "Pending Delivery") {
          dashboard["Total Pending Delivery"] =
            dashboard["Total Pending Delivery"] + 1;
        } else
          dashboard["Total Pending Payment"] =
            dashboard["Total Pending Payment"] + 1;
      });

      dashboard["Total Product"] = totalProducts.length;
      dashboard["Total Order"] = orderDetails.length;
      dashboard["Total Customer"] = orderDetails.length;

      return dashboard;
    } catch (error) {
      return null;
    }
  },
  ["get-dashborad"],
  {
    tags: ["dashboard"],
  }
);

export const getOrderData = cache(
  async (today?: boolean) => {
    const dashboard = {
      Order: 0,
      Processing: 0,
      Cancelled: 0,
      Completed: 0,
      Hold: 0,
      Pending: 0,
      "Pending Delivery": 0,
      Entry: 0,
    };

    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const orderDetails = await db
        .select()
        .from(orders)
        .where(!today ? undefined : gte(orders.createdAt, last24Hours));

      orderDetails.forEach((order) => {
        if (!order.courier) dashboard.Entry = dashboard.Entry + 1;

        //!order status
        if (order.status && order.status === "Delivered") {
          dashboard["Completed"] = dashboard["Completed"] + 1;
        } else if (order.status && order.status === "Processing") {
          dashboard["Processing"] = dashboard["Processing"] + 1;
        } else if (order.status && order.status === "Cancelled") {
          dashboard["Cancelled"] = dashboard["Cancelled"] + 1;
        } else if (order.status && order.status === "Hold") {
          dashboard["Hold"] = dashboard["Hold"] + 1;
        } else if (order.status && order.status === "Pending Delivery") {
          dashboard["Pending Delivery"] = dashboard["Pending Delivery"] + 1;
        } else dashboard["Pending"] = dashboard["Pending"] + 1;
      });

      dashboard["Order"] = orderDetails.length;

      return dashboard;
    } catch (error) {
      return null;
    }
  },
  ["get-order-data"],
  {
    tags: ["orders", "order_data"],
    revalidate: 24 * 3600,
  }
);

//!Categories

export const insertNewCategory = async (
  data: typeof categories.$inferInsert
) => {
  try {
    const cat = await db
      .insert(categories)
      .values(data)
      .onConflictDoUpdate({
        target: categories.category,
        set: { category: data.category, status: data.status },
      })
      .returning();

    revalidateTag("categories");
    return cat[0];
  } catch (error) {
    return null;
  }
};

export const getAllCategories = cache(
  async (status?: boolean) => {
    try {
      const cat = db
        .select()
        .from(categories)
        .orderBy(categories.serial)
        .where(
          status === undefined ? undefined : eq(categories.status, status)
        );

      return cat;
    } catch (error) {
      return null;
    }
  },
  ["get-all-categories"],
  {
    tags: ["categories"],
  }
);

export const deleteCategories = async (id: string) => {
  try {
    await db.delete(categories).where(eq(categories.category, id));
    revalidateTag("categories");
    return true;
  } catch (error) {
    return false;
  }
};

//!couriers
export const insertNewCouriers = async (data: typeof couriers.$inferInsert) => {
  try {
    const cat = await db
      .insert(couriers)
      .values(data)
      .onConflictDoUpdate({
        target: couriers.name,
        set: {
          name: data.name,
          status: data.status,
          charge: data.charge,
          city: data.city,
          serial: data.serial,
          zone: data.zone,
        },
      })
      .returning();

    revalidateTag("couriers");
    return cat[0];
  } catch (error) {
    return null;
  }
};

export const getAllCouriers = cache(
  async () => {
    try {
      const cur = db.select().from(couriers).orderBy(couriers.serial);

      return cur;
    } catch (error) {
      return null;
    }
  },
  ["get-all-couriers"],
  {
    tags: ["couriers"],
  }
);

export const deleteCouriers = async (name: string) => {
  try {
    await db.delete(couriers).where(eq(couriers.name, name));
    revalidateTag("couriers");
    return true;
  } catch (error) {
    return false;
  }
};

//!sliders
export const insertNewSlider = async (data: typeof sliders.$inferInsert) => {
  try {
    const exists = await db
      .select({ id: sliders.id })
      .from(sliders)
      .where(eq(sliders.id, data.id));

    let img;

    if (exists.length === 0) {
      img = await uploadImage(data.image);
    } else {
      img = {
        id: data.id,
        url: data.image,
      };
    }

    if (!img) return null;

    const cat = await db
      .insert(sliders)
      .values({
        id: img.id,
        image: img.url,
        status: data.status,
      })
      .onConflictDoUpdate({
        target: sliders.id,
        set: {
          status: data.status,
        },
      })
      .returning();

    revalidateTag("sliders");
    return cat[0];
  } catch (error) {
    return null;
  }
};

export const getAllSliders = cache(
  async (status?: boolean) => {
    try {
      const cur = db
        .select()
        .from(sliders)
        .orderBy(sliders.serial)
        .where(!status ? undefined : eq(sliders.status, status));
      return cur;
    } catch (error) {
      return null;
    }
  },
  ["get-all-sliders"],
  {
    tags: ["sliders"],
  }
);

export const deleteSliders = async (name: string) => {
  try {
    await db.delete(sliders).where(eq(sliders.id, name));
    revalidateTag("sliders");
    return true;
  } catch (error) {
    return false;
  }
};
