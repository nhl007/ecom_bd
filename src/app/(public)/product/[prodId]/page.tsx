import { getAllShipping } from "@/actions/preference";
import { getProductsById } from "@/actions/products";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCarousel from "@/components/ProductCarousel";
import ProductPageButtons from "@/components/ProductPageButtons";

import { ArrowRightIcon, ContactIcon, PhoneCallIcon } from "lucide-react";
import Link from "next/link";

const page = async ({ params: { prodId } }: { params: { prodId: string } }) => {
  const product = await getProductsById(prodId);
  const ship = await getAllShipping(true);

  if (!product) return <p>No product with this id</p>;

  return (
    <main className=" md:pb-10 mb-8 md:mb-0">
      <MaxWidthWrapper>
        <p className=" flex flex-wrap gap-2 items-center md:mt-4 mt-1 mb-2 text-xs md:text-base font-medium">
          <Link href="/">Home</Link>
          <ArrowRightIcon size={18} />
          <Link href={`/category/${product.category}`}>{product.category}</Link>
          <ArrowRightIcon size={18} />
          <span className=" font-semibold">{product.name}</span>
        </p>
        <div className=" flex md:flex-row flex-col md:gap-10 gap-4 border-b-2">
          <div className=" flex-1 relative">
            {product.discountPercentage ? (
              <span className=" z-50 absolute right-6 top-6 rounded-full w-16 h-16 bg-black  text-white text-sm font-semibold flex justify-center items-center">
                -{product.discountPercentage}%
              </span>
            ) : null}
            <ProductCarousel images={product.image} />
          </div>
          <div className=" flex-1 flex flex-col gap-4 md:p-6">
            <h1 className=" text-2xl md:text-3xl">{product.name}</h1>
            <p className=" text-black font-semibold flex items-center gap-2 text-2xl">
              মূল্য:{" "}
              {product.discountPrice && (
                <span className=" line-through text-xl text-gray-400 font-semibold">
                  {product.price}৳
                </span>
              )}
              {product.discountPrice ? product.discountPrice : product.price}৳
            </p>
            {product.stock > 0 ? (
              <>
                <p className=" text-green-400 font-semibold">
                  স্টক : ইন স্টক {`(${product.stock})`}
                </p>
                <ProductPageButtons {...product} />
              </>
            ) : (
              <p className=" text-red-500 font-semibold">স্টক : স্টক শেষ</p>
            )}
            <div className=" flex flex-col gap-4 text-xl md:text-2xl text-red-400 mt-4">
              <p className=" flex items-center gap-2">
                <ContactIcon /> ফোনে অর্ডারের জন্য ডায়াল করুন
              </p>
              <a
                className=" flex gap-2 items-center pl-4"
                href="tel:01784116079"
              >
                <PhoneCallIcon /> 01784116079
              </a>
            </div>

            {ship?.map((sh) => {
              return (
                <div
                  key={sh.name}
                  className=" flex justify-between border-y-2 py-3 text-xl"
                >
                  <p>{sh.name}</p>
                  <p> ৳ {sh.cost}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className=" pb-6 mt-8 border-b-2 text-xl md:text-3xl font-semibold">
            পন্যের বিবরণ
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
            className=" py-6"
          />
        </div>
      </MaxWidthWrapper>
    </main>
  );
};

export default page;
