"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProductsByName } from "@/actions/products";
import { products } from "@/db/products.schema";

interface ISearchBar {
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar = ({ setMenu }: ISearchBar) => {
  const [prod, setProd] = useState<(typeof products.$inferSelect)[]>([]);
  const [searchText, setSearchText] = useState("");

  const router = useRouter();

  const searchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(() => e.target.value);
    const products = await getProductsByName(e.target.value.toLowerCase());
    if (products) setProd(products);
  };
  return (
    <div className="flex relative">
      <Input
        onChange={searchChange}
        value={searchText}
        placeholder="Enter Product Name"
        className=" text-black md:w-[400px] rounded-r-none border-main_accent focus:border-black text-base"
      />
      <Button
        className=" rounded-l-none py-2 px-4"
        onClick={() => {
          router.push(`/s?keyword=${searchText}
    
    `);
          setSearchText("");
        }}
      >
        <SearchIcon size={18} />
      </Button>
      {searchText ? (
        <div className=" absolute text-black bg-gray-100 h-[120px] overflow-y-scroll no-scrollbar p-4 -bottom-[120px] z-[999] left-0 rounded-md min-w-full flex flex-col gap-1">
          {prod.length ? (
            prod.map((p, i) => {
              return (
                <Link
                  className=" pb-1 border-b-[1px] border-black text-xs md:text-sm font-medium"
                  onClick={() => {
                    setMenu(false);
                    setSearchText("");
                  }}
                  href={`/product/${p.id}`}
                  key={p.id}
                >
                  {p.name}
                </Link>
              );
            })
          ) : (
            <p>No products found!</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
