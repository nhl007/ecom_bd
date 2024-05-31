"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import useCartContext from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { products } from "@/db/products.schema";

const Product = ({
  id,
  name,
  price,
  discountPrice,
  discountPercentage,
  image,
  category,
  stock,
}: typeof products.$inferSelect) => {
  const { addToCart } = useCartContext();

  const router = useRouter();

  return (
    <div className="min-w-[200px] md:min-w-[283px] cursor-pointer md:h-[395px] flex flex-col gap-2 md:gap-3 relative group/prod overflow-hidden ">
      {discountPercentage ? (
        <span className=" z-50 absolute inset-0 left-2 top-2 rounded-full w-12 h-12 bg-black  text-white text-sm font-semibold flex justify-center items-center">
          -{discountPercentage}%
        </span>
      ) : null}
      <Image
        onClick={() => router.push(`/product/${id}`)}
        src={image.length ? image[0].url : "/fallback.png"}
        alt="product"
        width={283}
        height={283}
        className="flex max-w-full h-[150px] max-h-[150px] md:w-[283px] md:max-h-[283px] md:h-[283px] rounded-xl object-cover"
      />
      <p
        onClick={() => router.push(`/product/${id}`)}
        className="w-full min-h-4 text-sm text-gray-500 truncate "
      >
        {name}
      </p>

      <p className=" text-black font-semibold flex items-center gap-2">
        {discountPrice && (
          <span className=" line-through text-sm text-gray-400 font-semibold">
            {price}৳
          </span>
        )}
        {discountPrice ? discountPrice : price}৳
      </p>
      <Button
        className="z-50"
        onClick={() => {
          addToCart({
            name,
            price: discountPrice ? discountPrice : price,
            image,
            id,
            quantity: 1,
            category,
            stock,
          });
          router.push("/checkout");
        }}
      >
        অর্ডার করুন
      </Button>
    </div>
  );
};

export default Product;
