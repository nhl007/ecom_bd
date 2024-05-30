"use client";

import { getAllShipping } from "@/actions/preference";
import { createNewOrder } from "@/actions/products";
import LoadingSpinner from "@/components/Loading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/components/ui/use-toast";
import useCartContext from "@/contexts/CartContext";
import { shipping } from "@/db/preferences.schema";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";

const Page = () => {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, updateShipping, clearCart } =
    useCartContext();
  const { toast } = useToast();

  const [loading, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(false);

  const [ship, setShip] = useState<(typeof shipping.$inferSelect)[]>([]);

  const getShippingInfo = async () => {
    startTransition(async () => {
      const fShip = await getAllShipping();
      if (fShip) {
        setShip(fShip);
        updateShipping(fShip[0].name, fShip[0].cost);
      }
    });
  };

  useEffect(() => {
    getShippingInfo();
  }, []);

  const [customer, setCustomer] = useState({
    address: "",
    district: "Dhaka",
    name: "",
    phone: "",
  });

  const [note, setNote] = useState("");

  const createOrder = async () => {
    if (customer.name.length < 3)
      return toast({
        title: "Invalid Information!",
        description: `Invalid value of field name!`,
        variant: "destructive",
      });
    if (customer.address.length < 5)
      return toast({
        title: "Invalid Information!",
        description: `Invalid value of field customer!`,
        variant: "destructive",
      });
    if (!customer.district)
      return toast({
        title: "Invalid Information!",
        description: `Invalid value  of field district!`,
        variant: "destructive",
      });
    if (!customer.phone || customer.phone.length !== 11)
      return toast({
        title: "Invalid Information!",
        description: `Invalid Phone Number!`,
        variant: "destructive",
      });
    if (!cart.products.length)
      return toast({
        title: "Not enough product!",
        description: `Need at least one product on cart!`,
        variant: "destructive",
      });

    const delivery = ship.find((sh) => sh.name === cart.shipping);

    setIsLoading(true);
    const data = await createNewOrder({
      ...cart,
      customer: customer,
      note: note,
      delivery: delivery?.cost!,
    });
    setIsLoading(false);
    if (data.success) {
      clearCart();
      router.push(`/order-complete?order=${data.message}`);
      toast({
        title: "Order!",
        description: "Order Successfully completed!",
        variant: "success",
      });
    } else {
      toast({
        title: "Order!",
        description: data.message,
        variant: "destructive",
      });
    }
  };

  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <MaxWidthWrapper className=" md:my-10 mb-8">
      {loading && <LoadingSpinner />}
      <div className="min-w-full flex md:flex-row flex-col gap-2">
        {/* //? left side */}

        <div className=" flex-1 px-3 flex flex-col gap-4">
          <p className=" text-red-600 text-xl font-semibold">
            অর্ডারটি কনফার্ম করতে আপনার নাম, ঠিকানা, মোবাইল নাম্বার, লিখে অর্ডার
            কনফার্ম করুন বাটনে ক্লিক করুন
          </p>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="name">
              আপনার নাম <sup className=" text-red-500">*</sup>
            </Label>
            <Input onChange={handleCustomerDataChange} name="name" />
          </div>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="phone">
              আপনার মোবাইল<sup className=" text-red-500">*</sup>
            </Label>
            <Input
              onChange={handleCustomerDataChange}
              type="number"
              name="phone"
            />
          </div>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="street">
              আপনার ঠিকানা<sup className=" text-red-500">*</sup>
            </Label>
            <Input onChange={handleCustomerDataChange} name="address" />
          </div>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="ship">
              আপনার এরিয়া সিলেক্ট করুন<sup className=" text-red-500">*</sup>
            </Label>
            <div className="flex gap-4 pt-2 items-center">
              {ship.map((sh) => (
                <div
                  key={sh.name + sh.serial}
                  className="flex gap-2  items-center"
                >
                  <input
                    checked={cart.shipping === sh.name ? true : false}
                    onChange={(e) => updateShipping(e.target.value, sh.cost)}
                    value={sh.name}
                    type="radio"
                    className="w-4 h-4"
                  />
                  <label>{sh.name + ` (${sh.cost}৳)`}</label>
                </div>
              ))}
            </div>
          </div>
          <Button
            loader={isLoading}
            disabled={isLoading}
            className="mb-2 inline-block md:hidden"
            onClick={createOrder}
          >
            অর্ডার কনফার্ম করুন
          </Button>

          <div className=" md:flex flex-col gap-2 hidden">
            <Label htmlFor="note">
              Order Notes <sup className=" text-red-500">*</sup>
            </Label>
            <textarea
              onChange={(e) => setNote(e.target.value)}
              name="note"
              rows={7}
              className=" outline-none border-[1px] rounded-md pl-2"
            />
          </div>
        </div>
        {/* //? right side */}
        <div className=" flex-1 flex flex-col bg-gray-100 p-6 rounded-lg">
          <h1 className=" text-center text-2xl font-semibold">আপনার অর্ডার</h1>

          <div className=" bg-white p-6 rounded-lg mt-3">
            <div className="flex justify-between border-b-2 py-3 mb-3">
              <p>Products</p>
              <p>Sub Total</p>
            </div>
            <div className=" border-b-2 pt-2 pb-6 space-y-2">
              {cart.products?.length ? (
                cart.products.map((prod) => (
                  <YourOrder
                    key={prod.id + prod.name}
                    id={prod.id!}
                    image={
                      prod.image?.length ? prod.image[0].url : "/fallback.png"
                    }
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
            <div className="flex justify-between border-b-2 py-3 mb-3">
              <p>Sub Total</p>

              <p>{cart.total - cart.delivery!}৳</p>
            </div>

            <div className="flex justify-between border-b-2 py-3">
              <p>Total</p>
              <p className=" text-4xl">{cart.total}৳</p>
            </div>
          </div>
          <div className=" flex flex-col py-6 gap-4">
            <h2>Cash on delivery</h2>
            <p className=" bg-white py-3 px-4 rounded-lg font-semibold">
              Pay with cash upon delivery.
            </p>
            <div className=" flex flex-col gap-2 md:hidden">
              <Label htmlFor="note">Order Notes</Label>
              <textarea
                onChange={(e) => setNote(e.target.value)}
                name="note"
                rows={3}
                className=" outline-none border-[1px] rounded-md pl-2"
              />
            </div>
          </div>
          <Button loader={isLoading} disabled={isLoading} onClick={createOrder}>
            অর্ডার কনফার্ম করুন
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;

interface IYourOrderProps {
  name: string;
  image: string;
  price: number;
  quantity: number;
  id: string;
  updateQuantity: (id: string, count: number) => void;
  removeFromCart: (id: string, amount: number) => void;
}

const YourOrder = ({
  price,
  image,
  name,
  quantity,
  id,
  updateQuantity,
  removeFromCart,
}: IYourOrderProps) => {
  return (
    <div className=" flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div className=" flex gap-3 items-start md:items-center">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => removeFromCart(id, price)}
          className=" order-3 md:-order-1"
        >
          <X size={24} color="red" />
        </Button>
        <Image
          src={image}
          alt="prod"
          width={80}
          height={80}
          className=" max-w-[80px] h-auto object-cover rounded-md"
        />
        <div className=" flex flex-col gap-1">
          <p>{name}</p>
          <div className="  col-span-1 flex">
            <Button
              size="sm"
              onClick={() => updateQuantity(id, quantity - 1)}
              variant="outline"
              className=" border-[1px] rounded-none"
            >
              -
            </Button>
            <p className=" px-3 border-2 h-9 py-1.5">{quantity}</p>
            <Button
              size="sm"
              onClick={() => updateQuantity(id, quantity + 1)}
              variant="outline"
              className=" border-[1px] rounded-none"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between  md:mb-0 mb-3">
        <p className="md:hidden">Price :</p>
        <p>{quantity * price}৳</p>
      </div>
    </div>
  );
};
