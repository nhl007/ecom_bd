"use client";

import { getAllShipping } from "@/actions/preference";
import {
  createNewOrderAdmin,
  getAllCouriers,
  getProducts,
} from "@/actions/products";
import LoadingSpinner from "@/components/Loading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { shipping } from "@/db/preferences.schema";
import { couriers, products } from "@/db/products.schema";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";

const AdminOrderCreate = () => {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    address: "",
    name: "",
    phone: "",
  });
  const [note, setNote] = useState("");
  const [courierCus, setCourierCus] = useState("");
  const [delivery, setDelivery] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [cartProducts, setCartProducts] = useState<
    (typeof products.$inferSelect)[]
  >([]);

  const [productsList, setProductsList] = useState<
    (typeof products.$inferSelect)[]
  >([]);

  const [courierList, setCourierList] = useState<
    (typeof couriers.$inferSelect)[]
  >([]);

  const [pending, startTransition] = useTransition();

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

    if (!customer.phone || customer.phone.length < 11)
      return toast({
        title: "Invalid Information!",
        description: `Invalid value of field phone!`,
        variant: "destructive",
      });
    if (!cartProducts.length)
      return toast({
        title: "Not enough product!",
        description: `Need at least one product on cart!`,
        variant: "destructive",
      });

    if (!courierCus)
      return toast({
        title: "Please select courier!",
        description: `Please assign the order to the courier provider!`,
        variant: "destructive",
      });

    setLoading(true);

    const total = cartProducts.reduce(
      (acc, curr) =>
        acc +
        (curr.discountPercentage ? curr.discountPrice : curr.price) *
          (curr.quantity ? curr.quantity : 1),
      0
    );

    const data = await createNewOrderAdmin({
      products: cartProducts,
      total: total - discount + delivery,
      courier: courierCus ? courierCus : undefined,
      customer: customer,
      note: note,
      count: cartProducts.length,
      discount: discount,
      assigned: session.data?.user.name,
      delivery: delivery,
      shipping: selectedMethod,
    });

    setLoading(false);
    if (data.success) {
      router.push(`/admin/orders`);
      return toast({
        title: "Order!",
        description: "Order Successfully completed!",
        variant: "success",
      });
    }
    toast({
      title: "Order!",
      description: data.message,
      variant: "destructive",
    });
  };

  const [selectedMethod, setSelectedMethod] = useState("");

  const [ship, setShip] = useState<(typeof shipping.$inferSelect)[]>([]);

  const initOrderEdit = async () => {
    startTransition(async () => {
      const prod = await getProducts(true);
      if (prod) setProductsList(prod);
      const ship = await getAllShipping();
      if (ship) {
        setShip(ship);
        setSelectedMethod(ship[0].name);
      }
      const cur = await getAllCouriers();
      if (cur) setCourierList(cur);
    });
  };

  useEffect(() => {
    initOrderEdit();
  }, []);

  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <MaxWidthWrapper className=" mb-8">
      {pending && <LoadingSpinner />}
      <div className="min-w-full flex md:flex-row flex-col gap-2">
        {/* //? left side */}

        <div className=" flex-1 px-3 py-6 flex flex-col text-2xl gap-4">
          <h2>Customer Details</h2>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="name">
              Name <sup className=" text-red-500">*</sup>
            </Label>
            <Input onChange={handleCustomerDataChange} name="name" />
          </div>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="phone">
              Phone<sup className=" text-red-500">*</sup>
            </Label>
            <Input onChange={handleCustomerDataChange} name="phone" />
          </div>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="street">
              Address <sup className=" text-red-500">*</sup>
            </Label>
            <Input onChange={handleCustomerDataChange} name="address" />
          </div>

          <div className=" flex flex-col gap-2">
            <Label htmlFor="district">
              Courier Name <sup className=" text-red-500">*</sup>
            </Label>
            <Select value={courierCus} onValueChange={(v) => setCourierCus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Courier" />
              </SelectTrigger>
              <SelectContent>
                {courierList.map((dis) => (
                  <SelectItem key={dis.serial} value={dis.name}>
                    {dis.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className=" flex flex-col gap-2">
            <Label htmlFor="ship">Select Shipping Method</Label>
            <div className="flex gap-4 pt-2 items-center">
              {ship.map((sh) => (
                <div
                  key={sh.name + sh.serial}
                  className="flex gap-2  items-center"
                >
                  <input
                    checked={selectedMethod === sh.name ? true : false}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    value={sh.name}
                    type="radio"
                    className="w-4 h-4"
                  />
                  <label className=" text-sm">
                    {sh.name + ` (${sh.cost}৳)`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className=" flex flex-col gap-2">
            <Label htmlFor="note">
              Order Notes <sup className=" text-red-500">*</sup>
            </Label>
            <textarea
              onChange={(e) => setNote(e.target.value)}
              name="note"
              rows={4}
              className=" outline-none border-[1px] text-base rounded-md px-4"
            />
          </div>
        </div>
        {/* //? right side */}
        <div className=" flex-1 flex flex-col bg-gray-100 p-6 rounded-lg">
          <h1 className=" text-center text-2xl font-semibold">Your Order</h1>

          <div className=" bg-white p-6 rounded-lg mt-3">
            <Select
              onValueChange={(v) => {
                setCartProducts((prev) => {
                  const exists = cartProducts.find((p) => p.id === v);
                  if (!exists) {
                    const newCart = [
                      ...prev,
                      productsList.find((li) => li.id === v)!,
                    ];

                    return newCart;
                  }
                  return prev;
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Products" />
              </SelectTrigger>
              <SelectContent>
                {productsList.map((dis) => (
                  <SelectItem key={dis.id} value={dis.id}>
                    {dis.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-between border-b-2 py-3 mb-3">
              <p>Products</p>
              <p>Sub Total</p>
            </div>
            <div className=" border-b-2 pt-2 pb-6 space-y-2">
              {cartProducts.length ? (
                cartProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className=" flex flex-col md:flex-row justify-between md:items-center gap-4"
                  >
                    <div className=" flex gap-3 items-start md:items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setCartProducts(() =>
                            cartProducts.filter((c) => c.id !== prod.id)
                          );
                        }}
                        className=" order-3 md:-order-1"
                      >
                        <X size={24} color="red" />
                      </Button>
                      <Image
                        src={prod.image[0].url}
                        alt="prod"
                        width={80}
                        height={80}
                        className=" max-w-[80px] h-auto object-cover rounded-md"
                      />
                      <div className=" flex flex-col gap-1">
                        <p>{prod.name}</p>
                        <div className="  col-span-1 flex">
                          <Button
                            size="sm"
                            onClick={() => {
                              if ((prod.quantity ? prod.quantity : 1) <= 1)
                                return;
                              setCartProducts((prev) => {
                                const newProd = prev.map((p) => {
                                  if (p.id === prod.id)
                                    return {
                                      ...p,
                                      quantity: p.quantity! - 1,
                                    };
                                  else return p;
                                });
                                return newProd;
                              });
                            }}
                            variant="outline"
                            className=" border-[1px] rounded-none"
                          >
                            -
                          </Button>
                          <p className=" px-3 border-2 h-9 py-1.5">
                            {prod.quantity}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => {
                              setCartProducts((prev) => {
                                const newProd = prev.map((p) => {
                                  if (p.id === prod.id)
                                    return {
                                      ...p,
                                      quantity: p.quantity! + 1,
                                    };
                                  else return p;
                                });
                                return newProd;
                              });
                            }}
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
                      <p>
                        {(prod.quantity ? prod.quantity : 1) *
                          (prod.discountPercentage
                            ? prod.discountPrice
                            : prod.price)}
                        ৳
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className=" text-3xl font-semibold col-span-6 mt-10 place-self-center text-red-500">
                  No Product on Cart !
                </h1>
              )}
            </div>
            <div className="flex justify-between border-b-2 py-3 mb-3">
              <p>Sub Total</p>
              <p>
                {cartProducts.reduce((acc, c) => {
                  return (
                    acc +
                    (c.discountPercentage ? c.discountPrice : c.price) *
                      (c.quantity ? c.quantity : 1)
                  );
                }, 0)}
                ৳
              </p>
            </div>

            <div className="flex justify-between border-b-2 py-3">
              <p>Delivery</p>
              <Input
                name="delivery"
                type="number"
                className="w-20"
                onChange={(e) => setDelivery(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between border-b-2 py-3">
              <p>Discount</p>
              <Input
                name="discount"
                type="number"
                className="w-20"
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between border-b-2 py-3">
              <p>Total</p>
              <p className=" text-xl">
                {cartProducts.reduce((acc, c) => {
                  return (
                    acc +
                    (c.discountPercentage ? c.discountPrice : c.price) *
                      (c.quantity ? c.quantity : 1)
                  );
                }, 0) +
                  delivery -
                  discount}
                ৳
              </p>
            </div>
          </div>

          <Button loader={loading} disabled={loading} onClick={createOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default AdminOrderCreate;
