import { getProducts } from "@/actions/products";
import AdminProduct from "@/components/AdminProduct";

const page = async () => {
  const products = await getProducts();

  if (!products) {
    return (
      <div>
        <h1>No product Found</h1>
      </div>
    );
  }

  return (
    <main>
      <h1 className="text-2xl text-BBlue1 font-semibold mb-3">Product List</h1>
      <div className="grid grid-cols-4 gap-x-4 gap-y-4">
        {products.map((prod) => (
          <AdminProduct
            key={prod.id}
            id={prod.id}
            status={prod.status ? true : false}
            discountPercentage={prod.discountPercentage!}
            discountPrice={prod.discountPrice!}
            image={
              prod.image?.length
                ? prod.image[0].url
                : "/product mock/diamond.jpg"
            }
            name={prod.name}
            price={prod.price}
          />
        ))}
      </div>
    </main>
  );
};

export default page;
