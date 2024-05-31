import { getProductsByCategory } from "@/actions/products";
import HomeFeaturedCarousel from "@/components/HomeFeaturedCarousel";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Product from "@/components/Product";

const page = async () => {
  const hotDealsPromise = getProductsByCategory("Hot Offer", 8, 1);
  const homeGadgetsPromise = getProductsByCategory("Home And Gadgets", 8, 1);
  const healthBeautyPromise = getProductsByCategory("Health And Beauty", 8, 1);
  const babyProductsPromise = getProductsByCategory("Baby Products", 8, 1);

  const [hotDeals, homeGadgets, healthBeauty, babyProducts] = await Promise.all(
    [
      hotDealsPromise,
      homeGadgetsPromise,
      healthBeautyPromise,
      babyProductsPromise,
    ]
  );

  return (
    <div>
      <HomeFeaturedCarousel />
      <MaxWidthWrapper>
        {hotDeals ? (
          <div>
            <h1 className=" text-2xl mt-6 lg:mt-12 font-semibold">Hot Deals</h1>
            <div className="no-scrollbar md:grid md:grid-cols-4 flex gap-4 overflow-x-scroll my-6 lg:my-10 md:gap-y-6">
              {hotDeals.map((prod) => (
                <Product key={prod.id} {...prod} />
              ))}
            </div>
          </div>
        ) : null}
        {homeGadgets ? (
          <div>
            <h1 className=" text-2xl mt-12 font-semibold">Home And Gadgets</h1>
            <div className="no-scrollbar md:grid md:grid-cols-4 flex gap-4 overflow-x-scroll my-6 lg:my-10 md:gap-y-6">
              {homeGadgets.map((prod) => (
                <Product key={prod.id} {...prod} />
              ))}
            </div>
          </div>
        ) : null}
        {healthBeauty ? (
          <div>
            <h1 className=" text-2xl mt-12 font-semibold">Health & Beauty</h1>
            <div className="no-scrollbar md:grid md:grid-cols-4 flex gap-4 overflow-x-scroll my-6 lg:my-10 md:gap-y-6">
              {healthBeauty.map((prod) => (
                <Product key={prod.id} {...prod} />
              ))}
            </div>
          </div>
        ) : null}
        {babyProducts ? (
          <div>
            <h1 className=" text-2xl mt-12 font-semibold">Baby Products</h1>
            <div className="no-scrollbar md:grid md:grid-cols-4 flex gap-4 overflow-x-scroll my-6 lg:my-10 md:gap-y-6">
              {babyProducts.map((prod) => (
                <Product key={prod.id} {...prod} />
              ))}
            </div>
          </div>
        ) : null}
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
