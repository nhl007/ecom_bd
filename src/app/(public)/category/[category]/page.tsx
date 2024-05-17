import { getProductsByCategory } from "@/actions/products";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Product from "@/components/Product";
import { products } from "@/db/products.schema";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const page = async ({
  params: { category },
}: {
  params: { category: string };
}) => {
  const decodedCat = decodeURIComponent(category);

  const product = await getProductsByCategory(
    decodedCat as typeof products.$inferSelect.category,
    20,
    1
  );

  return (
    <main className="md:py-10 pt-0 pb-8">
      <MaxWidthWrapper>
        <p className=" flex gap-2 items-center clear-start mb-4 text-lg font-semibold">
          <Link href="/">Home</Link>
          <ArrowRightIcon size={18} />
          <Link href={`/category/${category}`}>{decodedCat}</Link>
        </p>
        {product ? (
          <div className="no-scrollbar md:grid md:grid-cols-4 flex gap-4 overflow-x-scroll md:gap-y-6">
            {product.map((prod) => (
              <Product key={prod.id} {...prod} />
            ))}
          </div>
        ) : (
          <p className=" text-3xl font-semibold text-center">
            No products added to this category!
          </p>
        )}
      </MaxWidthWrapper>
    </main>
  );
};

export default page;
