import { getOrderById } from "@/actions/products";
import { CheckCheckIcon, CheckCircle2Icon } from "lucide-react";
import { redirect } from "next/navigation";

const page = async ({
  searchParams: { order },
}: {
  searchParams: {
    order: string;
  };
}) => {
  if (!order) return redirect("/cart");
  const orderData = await getOrderById(order);
  if (!orderData) return redirect("/cart");
  return (
    <div className="flex justify-center items-center my-10 p-6">
      <div className="w-[400px] p-6 bg-green-500 text-white font-semibold flex gap-4 flex-col rounded-lg justify-center items-center">
        <p className=" text-3xl">Congratulation!</p>
        <CheckCircle2Icon size={48} />
        <p>Order Completed!</p>
        <p className=" text-sm font-medium">Invoice: {orderData.id}</p>
      </div>
    </div>
  );
};

export default page;
