import { NavigationIcon, PhoneCallIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { getPreferences } from "@/actions/preference";

const Footer = async () => {
  const preference = await getPreferences();

  return (
    <footer className="bg-main_accent text-white">
      <MaxWidthWrapper className=" py-8">
        <div className=" flex justify-between flex-wrap md:flex-nowrap">
          <div className=" flex flex-col gap-2 text-sm md:text-base">
            <Link href="/">
              <Image
                src={preference?.logo ? preference.logo.url : "/logo.jpg"}
                alt="logo"
                height="80"
                width="80"
                className=" w-[80px] max-h-[80px] rounded-full"
              />
            </Link>

            <div className="flex items-center gap-2 text">
              <NavigationIcon size={18} />
              <span>
                {preference ? preference.address : `Nandipara, Basabo, 1214`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCallIcon size={18} />
              {preference && preference.phone ? (
                <a href={preference.phone}>Phone : {preference.phone}</a>
              ) : (
                <a href="tel:09649809080">Phone : 09649809080</a>
              )}
            </div>
          </div>
          <div className=" flex flex-col gap-2 text-sm md:text-base">
            <span className=" md:text-lg font-semibold">Information</span>
            <Link href="/about-us">About Us</Link>
            <Link href="/delivery-payment">Delivery & Payment</Link>
            <Link href="/replace-refund">Replace & Refund</Link>
            <Link href="/">Terms & Conditions</Link>
          </div>
          {/* <div className=" flex flex-col gap-2 text-sm md:text-base">
            <span className=" md:text-lg font-semibold">Top Category</span>
            <Link href="/Health And Beauty">Health And Beauty</Link>
            <Link href="/Alpha Soap">Alpha Soap</Link>
          </div> */}

          <div className=" flex flex-col gap-2 mt-2 md:mt-0">
            <span className=" md:text-lg font-semibold">Payment System</span>
            <div className=" flex items-center gap-1">
              <Image
                src="/payment_method.png"
                alt="logo"
                height="200"
                width="350"
                className=" max-h-[30px] max-w-[200px]"
              />
              <Image
                src="/payment_method_2.png"
                alt="logo"
                height="200"
                width="350"
                className=" max-h-[30px] md:max-w-[200px] sm:max-w-[100px]"
              />
            </div>
            <span className=" md:text-lg font-semibold">Delivery Partners</span>
            <Image
              src="/delivary_partner.png"
              alt="logo"
              height="200"
              width="350"
            />
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="py-6  border-t-[1px] border-t-gray-200 text-center">
        <span>{preference?.copyright}</span>
      </div>
    </footer>
  );
};

export default Footer;
