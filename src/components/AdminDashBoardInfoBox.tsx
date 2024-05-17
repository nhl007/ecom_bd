import { cn } from "@/lib/utils";
import React from "react";

const AdminDashBoardInfoBox = ({
  name,
  data,
  className,
}: {
  name: string;
  data: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        " bg-slate-100 col-span-1 border-t-4 rounded border-t-teal-300 p-5 space-y-4",
        className
      )}
    >
      <p className=" font-medium">{name}</p>
      <p className=" text-3xl font-semibold">{data}</p>
    </div>
  );
};

export default AdminDashBoardInfoBox;
