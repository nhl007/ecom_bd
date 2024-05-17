import { getProductsByName } from "@/actions/products";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Product from "@/components/Product";

const page = async ({
  searchParams: { keyword },
}: {
  searchParams: {
    keyword: string;
  };
}) => {
  if (!keyword)
    return (
      <p className=" my-20 text-3xl text-center"> Invalid Search Key Word</p>
    );

  const products = await getProductsByName(keyword.toLowerCase());

  if (!products)
    return (
      <p className=" my-20 text-3xl text-center"> Invalid Search Key Word</p>
    );

  return (
    <MaxWidthWrapper>
      <h2 className=" my-3 text-xl font-semibold">
        Search results for: {keyword}
      </h2>
      <div className=" md:grid md:grid-cols-4 md:gap-y-6 my-6 flex gap-3 overflow-x-scroll no-scrollbar">
        {products.map((prod) => (
          <Product key={prod.id} {...prod} />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
