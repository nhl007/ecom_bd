"use client";

import { getAllShipping } from "@/actions/preference";
import CartItem from "@/components/CartItem";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import useCartContext from "@/contexts/CartContext";
import { shipping } from "@/db/preferences.schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateShipping,
    updateShipDetails,
  } = useCartContext();

  const [ship, setShip] = useState<(typeof shipping.$inferSelect)[]>([]);

  const getShippingInfo = async () => {
    const fShip = await getAllShipping();
    if (fShip) {
      setShip(fShip);
      updateShipDetails(fShip[0].name, fShip[0].cost);
    }
  };

  useEffect(() => {
    getShippingInfo();
  }, []);

  const router = useRouter();
  return (
    <MaxWidthWrapper className=" md:my-10 mt-2 mb-8">
      <div className=" flex flex-col md:flex-row gap-3 md:justify-between">
        <div className="flex flex-col gap-2 md:gap-0 md:grid md:grid-cols-6  w-full md:gap-y-4 md:place-items-center md:justify-items-start md:place-content-start">
          <div className="hidden md:block col-span-3 border-b-2 pb-2  w-full">
            <h1>Product</h1>
          </div>
          <div className=" hidden md:block col-span-1 border-b-2 pb-2  w-full">
            <h1>Price</h1>
          </div>
          <div className=" hidden md:block col-span-1 border-b-2 pb-2  w-full">
            <h1>Quantity</h1>
          </div>
          <div className=" hidden md:block col-span-1 border-b-2 pb-2  w-full">
            <h1>Sub Total</h1>
          </div>
          {cart.products?.length ? (
            cart.products.map((prod) => (
              <CartItem
                key={prod.id + prod.name}
                id={prod.id!}
                image={prod.image ? prod.image[0].url : ""}
                name={prod.name}
                price={prod.price}
                quantity={prod.quantity ?? 0}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))
          ) : (
            <h1 className=" text-3xl font-semibold col-span-6 mt-10 place-self-center text-red-500">
              No Product on Cart !
            </h1>
          )}
        </div>

        <div className=" p-6 border-2 rounded-lg md:min-w-[400px]">
          <h1 className=" text-4xl my-2">Cart Total</h1>
          <div className="flex justify-between border-b-[1px] py-3">
            <p>Sub Total</p>
            <p>{cart.total - cart.delivery!}৳</p>
          </div>

          <div className="flex justify-between border-b-[1px] py-3">
            <p>Shipping</p>
            <div>
              {ship.map((sh) => (
                <div
                  key={sh.name + sh.serial}
                  className="flex gap-2 justify-end"
                >
                  <label className="text-sm">{sh.name + ` (${sh.cost})`}</label>
                  <input
                    checked={cart.shipping === sh.name ? true : false}
                    onChange={(e) => updateShipping(e.target.value, sh.cost)}
                    value={sh.name}
                    type="radio"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between py-3">
            <p>Total</p>
            <p className=" text-3xl">{cart.total} ৳</p>
          </div>
          <Button
            onClick={() => router.push("/checkout")}
            className=" w-full text-lg font-semibold mt-2"
          >
            অর্ডার করুন
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
