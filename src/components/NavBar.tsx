"use client";

import SearchBar from "./SearchBar";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ProductCategories } from "@/constants/product";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { HomeIcon, Menu, PhoneCallIcon, X } from "lucide-react";
import Image from "next/image";
import CartIcon from "./CartIcon";
import { categories } from "@/db/products.schema";
import { getAllCategories } from "@/actions/products";
import LoadingSpinner from "./Loading";
import { getPreferences } from "@/actions/preference";

const NavBar = () => {
  const url = usePathname();
  const [menu, setMenu] = useState(false);
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState("");

  const [category, setCategory] = useState<(typeof categories.$inferSelect)[]>(
    []
  );

  const [loading, startTransition] = useTransition();

  const initCat = async () => {
    startTransition(async () => {
      const category = await getAllCategories(true);
      const preference = await getPreferences();
      if (preference) {
        setLogo(preference.logo.url);
        setPhone(preference.phone);
      }
      if (category) setCategory(category);
    });
  };

  useEffect(() => {
    initCat();
  }, []);

  return (
    <nav className=" flex flex-col">
      {loading && <LoadingSpinner />}
      <MaxWidthWrapper className="flex w-full justify-between py-4 items-center">
        <Menu
          onClick={() => setMenu(true)}
          className=" text-main_accent md:hidden"
          size={32}
        />

        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            height="80"
            width="80"
            className=" w-[60px] max-h-[60px] md:w-[80px] md:max-h-[80px] rounded-full"
          />
        </Link>
        <div className="hidden md:block">
          <SearchBar setMenu={setMenu} />
        </div>

        <div className=" flex gap-1 md:gap-4">
          {phone ? (
            <a
              href={`tel:${phone}`}
              title="Contact Number"
              className="hidden  py-2 px-3  bg-main_accent text-white font-medium rounded-sm md:flex items-center gap-2"
            >
              <PhoneCallIcon size={18} />
              {phone}
            </a>
          ) : (
            <a
              href="tel:09649809080"
              title="Contact Number"
              className="hidden  py-2 px-3  bg-main_accent text-white font-medium rounded-sm md:flex items-center gap-2"
            >
              <PhoneCallIcon size={18} />
              09649809080
            </a>
          )}
          <CartIcon />
        </div>

        {menu && (
          <div className="md:hidden fixed top-0 right-0 min-h-screen w-full bg-main_accent z-[999] space-y-2 text-white font-semibold text-lg px-4">
            <div className=" flex justify-between py-3 px-4 border-b items-center">
              <p className=" text-2xl">Menu</p>
              <X size={32} onClick={() => setMenu(false)} />
            </div>
            <div className=" flex flex-col gap-2 pl-4">
              <div className=" pr-4">
                <SearchBar setMenu={setMenu} />
              </div>
              {ProductCategories.map((cat) => {
                return (
                  <Link
                    onClick={() => setMenu(false)}
                    href={`/category/${cat.name}`}
                    key={cat.id}
                    className={cn(
                      " transform transition-all duration-500 ease-in-out text-lg",
                      url.includes(encodeURIComponent(cat.name))
                        ? " font-bold text-xl"
                        : ""
                    )}
                  >
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>
            {phone ? (
              <a
                href={`tel:${phone}`}
                title="Contact Number"
                className="m-auto py-2 pl-3  bg-gray-900 text-white font-medium flex items-center gap-2"
              >
                <PhoneCallIcon size={18} />
                {phone}
              </a>
            ) : (
              <a
                href="tel:09649809080"
                title="Contact Number"
                className="m-auto py-2 pl-3  bg-gray-900 text-white font-medium flex items-center gap-2"
              >
                <PhoneCallIcon size={18} />
                09649809080
              </a>
            )}
          </div>
        )}
      </MaxWidthWrapper>
      <div className=" hidden md:block bg-main_accent h-[50px] w-full py-3">
        <MaxWidthWrapper className="flex gap-6 text-white font-medium items-center">
          <Link href="/" className={cn(url === "/" ? "font-bold text-xl" : "")}>
            Home
          </Link>
          {category.map((cat) => {
            return (
              <Link
                href={`/category/${cat.category}`}
                key={cat.serial}
                className={cn(
                  " transform transition-all text-white duration-500 ease-in-out",
                  url.includes(encodeURIComponent(cat.category))
                    ? " font-bold text-xl"
                    : ""
                )}
              >
                <span>{cat.category}</span>
              </Link>
            );
          })}
        </MaxWidthWrapper>
      </div>

      <div className="md:hidden text-main_accent bg-white fixed bottom-0 left-0 h-[12%] w-full z-[999] flex justify-around items-center">
        <Link className=" flex items-center justify-center flex-col" href="/">
          <HomeIcon size={20} />
          <span>Home</span>
        </Link>

        {phone ? (
          <a
            className=" flex items-center justify-center flex-col"
            href={`tel:${phone}`}
          >
            <PhoneCallIcon size={20} />
            <span>Call Now</span>
          </a>
        ) : (
          <a
            className=" flex items-center justify-center flex-col"
            href="tel:09649809080"
          >
            <PhoneCallIcon size={20} />
            <span>Call Now</span>
          </a>
        )}
        <CartIcon />
      </div>
    </nav>
  );
};

export default NavBar;
