"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import Link from "next/link";
import { deleteProduct } from "@/actions/products";
import { cn } from "@/lib/utils";

interface IProductProps {
  name: string;
  price: number;
  discountPrice: number;
  discountPercentage: number;
  image: string;
  id: string;
  status: boolean;
}

const AdminProduct = ({
  id,
  name,
  price,
  discountPrice,
  discountPercentage,
  image,
  status,
}: IProductProps) => {
  const router = useRouter();

  const link = name.toLowerCase().split(" ").join("-").concat(`_${id}`);
  const [modal, setModal] = useState(false);

  return (
    <div className="min-w-[200px] max-w-[300px]  flex flex-col gap-2 md:gap-3 relative group/prod overflow-hidden ">
      {discountPercentage ? (
        <span className=" z-50 absolute inset-0 left-2 top-2 rounded-full w-12 h-12 bg-black  text-white text-sm font-semibold flex justify-center items-center">
          -{discountPercentage}%
        </span>
      ) : null}
      <Image
        onClick={() => router.push(`/product/${link}`)}
        src={image}
        alt="product"
        width={283}
        height={283}
        className="flex max-w-[283px] max-h-[200px] rounded-xl object-cover cursor-pointer"
      />
      <p
        onClick={() => router.push(`/product/${link}`)}
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

      <p
        className={cn(
          " text-sm font-semibold rounded-md",
          status ? "text-green-500" : "text-red-500"
        )}
      >
        {status ? "Published" : "UnPublished"}
      </p>

      <div className="flex gap-2">
        <Link
          href={`/admin/products/update/${id}`}
          className="bg-yellow-400 px-4 py-1.5 rounded-md text-white flex justify-center items-center"
        >
          Edit
        </Link>
        <Button className=" bg-red-500" onClick={() => setModal(true)}>
          Delete
        </Button>
      </div>
      {modal && (
        <ConfirmationModal setModal={setModal}>
          <div className=" flex flex-col gap-4">
            <p className=" text-lg font-semibold">Are you sure</p>
            <Button
              onClick={async () => {
                await deleteProduct(id);
                setModal(false);
              }}
              className=" bg-red-400 w-fit"
            >
              Confirm
            </Button>
          </div>
        </ConfirmationModal>
      )}
    </div>
  );
};

export default AdminProduct;
