"use client";

import {
  getDashBoardData,
  getLastTenOrders,
  getOrderData,
} from "@/actions/products";
import AdminDashBoardInfoBox from "@/components/AdminDashBoardInfoBox";
import LoadingSpinner from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orders } from "@/db/products.schema";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type TOBJ =
  | "Total Revenue"
  | "Total Staff"
  | "Total Customer"
  | "Total Product"
  | "Total Order"
  | "Total Cancelled"
  | "Total Completed"
  | "Total Processing"
  | "Total Pending Payment"
  | "Total Hold"
  | "Total Pending Delivery"
  | "Total Pending Entry";

const DashBoard = () => {
  const [pending, startTransition] = useTransition();

  const [data, setData] = useState({
    "Total Revenue": 0,
    "Total Staff": 0,
    "Total Customer": 0,
    "Total Product": 0,
    "Total Order": 0,
    "Total Cancelled": 0,
    "Total Completed": 0,
    "Total Processing": 0,
    "Total Pending Payment": 0,
    "Total Hold": 0,
    "Total Pending Delivery": 0,
    "Total Pending Entry": 0,
  });

  const [todaysData, setTodaysData] = useState({
    Order: 0,
    Pending: 0,
    Processing: 0,
    Cancelled: 0,
    Completed: 0,
    Hold: 0,
    Entry: 0,
  });

  const [lastTen, setLastTen] = useState<(typeof orders.$inferSelect)[]>([]);

  const init = async () => {
    startTransition(async () => {
      const d = await getDashBoardData();
      if (d) setData(d);
      const t = await getOrderData(true);
      if (t) setTodaysData(t);
      const r = await getLastTenOrders();
      if (r) setLastTen(r);
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div className=" grid grid-cols-4 gap-x-4 gap-y-4">
        {pending && <LoadingSpinner />}
        <AdminDashBoardInfoBox
          name={"Total Revenue"}
          data={data["Total Revenue"]}
        />
        <Link href="/admin/customers">
          <AdminDashBoardInfoBox
            name={"Total Customer"}
            data={data["Total Customer"]}
          />
        </Link>

        <Link href="/admin/user">
          <AdminDashBoardInfoBox
            name={"Total Staff"}
            data={data["Total Staff"]}
          />
        </Link>
        <Link href="/admin/products">
          <AdminDashBoardInfoBox
            name={"Total Products"}
            data={data["Total Product"]}
          />
        </Link>
        <Link href="admin/orders/">
          <AdminDashBoardInfoBox
            name={"Total Order"}
            data={data["Total Order"]}
          />
        </Link>
        <Link href="admin/orders?status=Processing">
          <AdminDashBoardInfoBox
            name={"Total Processing"}
            data={data["Total Processing"]}
          />
        </Link>
        <Link href="admin/orders?status=Pending Payment">
          <AdminDashBoardInfoBox
            name={"Total Pending Payment"}
            data={data["Total Pending Payment"]}
          />
        </Link>
        <Link href="admin/orders?status=Delivered">
          <AdminDashBoardInfoBox
            name={"Total Completed"}
            data={data["Total Completed"]}
          />
        </Link>

        <Link href="admin/orders?status=Cancelled">
          <AdminDashBoardInfoBox
            name={"Total Cancelled"}
            data={data["Total Cancelled"]}
          />
        </Link>
        <Link href="admin/orders?status=Hold">
          <AdminDashBoardInfoBox
            name={"Total Hold"}
            data={data["Total Cancelled"]}
          />
        </Link>

        <Link href="admin/orders?status=Pending Delivery">
          <AdminDashBoardInfoBox
            name={"Total Pending Delivery"}
            data={data["Total Pending Delivery"]}
          />
        </Link>
        <Link href="admin/orders?entry=true">
          <AdminDashBoardInfoBox
            name={"Total Pending Entry"}
            data={data["Total Pending Entry"]}
          />
        </Link>
      </div>

      <div className=" grid grid-cols-3 mt-10 gap-x-4">
        <div className=" col-span-1 bg-slate-100 rounded-lg p-6">
          <h1 className=" mt-2 mb-4 pb-1 border-b-2">{`Today's Report`}</h1>
          {Object.keys(todaysData).map((d, i) => {
            return (
              <div
                className={cn(
                  " flex justify-between items-center py-2 px-5",
                  i % 2 === 0 ? "bg-white" : " bg-red-100"
                )}
                key={d}
              >
                <span>
                  {d === "Entry"
                    ? "Pending Entry"
                    : d === "Pending"
                    ? "Pending Payment"
                    : d}
                </span>
                {/*@ts-ignore */}
                <span>{todaysData[d]}</span>
              </div>
            );
          })}
        </div>

        <div className=" col-span-2 px-6 py-4 bg-slate-50 rounded-xl">
          <h1 className=" mt-2 mb-4 pb-2.5 border-b-2">Recent Sales</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">SL.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Customer Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lastTen.map((ten, i) => (
                <TableRow key={ten.id}>
                  <TableCell className="font-medium">{1 + i}</TableCell>
                  <TableCell>
                    {new Date(ten.createdAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{ten.customer.name}</TableCell>
                  <TableCell>{ten.customer.phone}</TableCell>
                  <TableCell>{ten.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
