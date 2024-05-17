"use client";

import useCartContext from "@/contexts/CartContext";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

const CartIcon = () => {
  const {
    cart: { count },
  } = useCartContext();
  return (
    <Link className=" my-auto relative" href="/cart" title="Cart">
      <ShoppingCartIcon className=" text-main_accent" size={32} />{" "}
      <span className=" absolute -top-[13px] w-5 h-5 flex justify-center items-center right-[2px] rounded-full bg-main_accent text-white text-[10px]">
        {count}
      </span>
    </Link>
  );
};

export default CartIcon;
