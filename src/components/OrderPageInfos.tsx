// "use client";

// import { orders } from "@/db/products.schema";
// import { Button } from "./ui/button";
// import { steadFeastApi } from "@/lib/steadfast";
// import { toast } from "./ui/use-toast";

// type TSteadFastApiPostParams = {
//   invoice: string;
//   recipient_name: string;
//   recipient_phone: string;
//   recipient_address: string;
//   cod_amount: number;
//   note: string;
// };

// const OrderPageInfos = ({
//   data,
//   selected,
// }: {
//   data: (typeof orders.$inferSelect)[];
//   selected: string[];
// }) => {
//   const bulkUpdateSteadFast = async () => {
//     const updateData: TSteadFastApiPostParams[] = [];

//     data.forEach((o) => {
//       if (selected.includes(o.id)) {
//         updateData.push({
//           cod_amount: o.total,
//           invoice: o.id,
//           note: o.note ?? "No notes for this order",
//           recipient_address: o.customer.address,
//           recipient_name: o.customer.name,
//           recipient_phone: o.customer.phone,
//         });
//       }
//     });

//     const response = await steadFeastApi(updateData);

//     if (response)
//       return toast({
//         title: "Successfully created order on stead fast!",
//         variant: "success",
//       });
//     toast({
//       title: "Error Occurred!",
//       variant: "destructive",
//     });
//   };

//   return (
//     <div className=" my-3 flex gap-5">
//       <Button onClick={bulkUpdateSteadFast}>Stead Fast Update</Button>
//       <Button onClick={bulkUpdateSteadFast}>Print Pdf</Button>
//     </div>
//   );
// };

// export default OrderPageInfos;
