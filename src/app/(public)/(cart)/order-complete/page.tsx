import { getOrderById } from "@/actions/products";
import { CheckCircle2Icon } from "lucide-react";
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
      <div className="md:w-[700px] p-6 bg-green-500 text-white font-semibold flex gap-4 flex-col rounded-lg justify-center items-center">
        <p className=" text-3xl">Congratulation!</p>
        <CheckCircle2Icon size={48} />
        <p>Order Completed!</p>
        <p className=" text-center text-2xl">
          আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে আমাদের কল সেন্টার থেকে ফোন করে
          আপনার অর্ডারটি কনফার্ম করা হবে !
        </p>
        <p className=" text-lg font-medium">Invoice: {orderData.invoice}</p>
      </div>
    </div>
  );
};

export default page;
