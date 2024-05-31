"use client";

import useCartContext from "@/contexts/CartContext";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/db/products.schema";

const ProductPageButtons = ({
  id,
  name,
  price,
  discountPrice,
  image,
  category,
  stock,
  quantity,
}: typeof products.$inferSelect) => {
  const { addToCart } = useCartContext();
  const router = useRouter();
  const [newQuantity, setNewQuantity] = useState(quantity!);
  return (
    <>
      <Button
        size="lg"
        onClick={() => {
          addToCart({
            name,
            price: discountPrice ? discountPrice : price,
            image,
            id,
            quantity: newQuantity > 0 ? quantity : 1,
            category,
            stock,
          });
          router.push("/checkout");
        }}
      >
        অর্ডার করুন
      </Button>

      <div className=" flex items-center flex-wrap">
        <p className=" mr-2 ">পরিমান :</p>
        <Button
          onClick={() => {
            if (newQuantity < 2) return;
            setNewQuantity((prev) => prev - 1);
          }}
          variant="outline"
          className=" border-2 rounded-none"
        >
          -
        </Button>
        <p className="py-1.5 px-3 border-2 h-fit">{newQuantity}</p>
        <Button
          onClick={() => {
            if (newQuantity >= stock) return;

            setNewQuantity((prev) => prev + 1);
          }}
          variant="outline"
          className=" border-2 rounded-none"
        >
          +
        </Button>
      </div>
    </>
  );
};

export default ProductPageButtons;
