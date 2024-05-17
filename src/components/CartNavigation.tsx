"use client";

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const CartNavigation = () => {
  const url = usePathname();

  return (
    <div className=" my-4 bg-gray-100 py-4 flex justify-center items-center gap-2 md:text-xl text-sm font-medium">
      <Link
        className={cn(
          " transform transition-all duration-300 ease-in-out",
          url === "/cart" ? " font-bold md:text-2xl text-lg" : "hidden md:block"
        )}
        href="/cart"
      >
        SHOPPING CART
      </Link>
      <ArrowRightIcon className="hidden md:block" size={24} />
      <Link
        className={cn(
          " transform transition-all duration-300 ease-in-out",
          url === "/checkout"
            ? " font-bold md:text-2xl text-lg"
            : "hidden md:block"
        )}
        href="/checkout"
      >
        CHECKOUT
      </Link>
      <ArrowRightIcon className="hidden md:block" size={24} />
      <p
        className={cn(
          " transform transition-all duration-300 ease-in-out pointer-events-none",
          url === "/order-complete"
            ? " font-bold md:text-2xl text-lg"
            : "hidden md:block"
        )}
      >
        ORDER COMPLETE
      </p>
    </div>
  );
};

export default CartNavigation;
