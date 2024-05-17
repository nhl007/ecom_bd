"use client";

import { steadFeastApi } from "@/lib/steadfast";

type TSteadFastApiPostParams = {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note: string;
};

type TOBJ =
  | "Order"
  | "Pending"
  | "Cancelled"
  | "Delivered"
  | "Hold"
  | "Processing";

import {
  deleteOrderById,
  filterOrders,
  getAllCouriers,
  getOrderData,
  updateOrder,
} from "@/actions/products";
import FullScreenModal from "@/components/FullScreenModal";
import LoadingSpinner from "@/components/Loading";
import { ReactPdfDoc } from "@/components/ReactPdfDoc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { couriers, orders, orderStatusEnum } from "@/db/products.schema";
import { cn } from "@/lib/utils";
import { PDFViewer } from "@react-pdf/renderer";
import { DeleteIcon, FileEditIcon, PrinterIcon, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "@/components/ui/use-toast";
import AdminDashBoardInfoBox from "@/components/AdminDashBoardInfoBox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type IReactPdfDoc = Pick<
  typeof orders.$inferSelect,
  "createdAt" | "customer" | "total" | "shipping" | "products" | "id"
>;

const OrderAdmin = () => {
  const [orderData, setOrdersData] = useState<(typeof orders.$inferSelect)[]>(
    []
  );

  const router = useRouter();

  const searchP = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);

  const [pending, startTransition] = useTransition();
  const [dash, setDash] = useState({
    Order: 0,
    Pending: 0,
    Cancelled: 0,
    Delivered: 0,
    Hold: 0,
    Processing: 0,
  });

  const [phoneQuery, setPhoneQuery] = useState<string>();

  const [courierCus, setCourierCus] = useState("");

  const [courierList, setCourierList] = useState<
    (typeof couriers.$inferSelect)[]
  >([]);

  const orderLoad = useCallback(async () => {
    // const courierParam = searchP.get("courier");
    const phone = searchP.get("phone");
    const status = searchP.get("status");
    startTransition(async () => {
      const courier = await getAllCouriers();
      if (courier) setCourierList(courier);

      const ord = await filterOrders({
        courier: courierCus,
        phone: phone,
        // @ts-ignore
        status: [
          "Delivered",
          "Pending",
          "Cancelled",
          "Hold",
          "Processing",
        ].includes(status!)
          ? status
          : null,
      });
      if (!ord) {
        return setOrdersData([]);
      }

      setOrdersData(ord);
    });
  }, [searchP, courierCus]);

  useEffect(() => {
    const orderDataInit = async () => {
      const da = await getOrderData();

      if (!da)
        return setDash(() => {
          return {
            Order: 0,
            Delivered: 0,
            Cancelled: 0,
            Pending: 0,
            Hold: 0,
            Processing: 0,
          };
        });
      setDash(() => {
        return {
          Order: da.Order,
          Delivered: da.Completed,
          Cancelled: da.Cancelled,
          Pending: da.Pending,
          Hold: da.Hold,
          Processing: da.Processing,
        };
      });
    };

    orderDataInit();
  }, []);

  useEffect(() => {
    orderLoad();
  }, [orderLoad]);

  const handleCheckboxChange = (id: string) => {
    setSelected((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((checkedId) => checkedId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  const bulkUpdateSteadFast = async () => {
    if (selected.length === 0)
      return toast({
        title: "Please select a row first",
        variant: "destructive",
      });

    const updateData: TSteadFastApiPostParams[] = [];

    orderData.forEach((o) => {
      if (selected.includes(o.id)) {
        updateData.push({
          cod_amount: o.total,
          invoice: o.id,
          note: o.note ?? "No notes for this order",
          recipient_address: o.customer.address,
          recipient_name: o.customer.name,
          recipient_phone: o.customer.phone,
        });
      }
    });

    const response = await steadFeastApi(updateData);

    if (response)
      return toast({
        title: "Successfully created order on stead fast!",
        variant: "success",
      });
    toast({
      title: "Error Occurred!",
      variant: "destructive",
    });
  };

  const [showPdf, setShowPdf] = useState(false);

  const [pdfData, setPdfData] = useState<IReactPdfDoc[]>([]);

  const bulkPrintPdf = () => {
    const data = orderData.filter((data) => selected.includes(data.id));
    if (data.length === 0)
      return toast({
        title: "Please select a row first",
        variant: "destructive",
      });
    setPdfData(data);
    setShowPdf(true);
  };

  return (
    <div>
      {showPdf && (
        <FullScreenModal modalCloseValue={false} setModal={setShowPdf}>
          <PDFViewer showToolbar width="80%" height={600}>
            <ReactPdfDoc data={pdfData} />
          </PDFViewer>
        </FullScreenModal>
      )}
      {pending ? (
        <LoadingSpinner />
      ) : !orderData ? null : (
        <>
          <div className=" grid grid-cols-4 gap-x-4 gap-y-4 mt-4 mb-8 ">
            {Object.keys(dash).map((d) => (
              <Link key={d} href={`/admin/orders?status=${d}`}>
                <AdminDashBoardInfoBox
                  name={"Total " + d + (d === "Pending" ? " Payment" : "")}
                  data={dash[d as TOBJ]}
                  className={
                    d === "Total"
                      ? "text-sky-500 border-sky-500"
                      : d === "Pending"
                      ? "border-teal-500 text-teal-500"
                      : d === "Cancelled"
                      ? "border-red-500 text-red-500"
                      : d === "Delivered"
                      ? "text-green-500 border-green-500"
                      : d === "Hold"
                      ? "text-indigo-500 border-indigo-500"
                      : "border-pink-500 text-pink-500"
                  }
                />
              </Link>
            ))}
          </div>
          {/* <OrderPageInfos data={orderData} selected={selected} /> */}

          <div className=" flex justify-between mt-4 mb-6 items-center">
            <div className="  flex gap-5">
              <Link
                className=" py-2 px-4 bg-amber-800 hover:bg-main_accent rounded-md text-white"
                href="/admin/orders/create"
              >
                Create an Order
              </Link>
              <Button className=" bg-blue-950" onClick={bulkUpdateSteadFast}>
                Stead Fast Export
              </Button>
              <Button className="bg-teal-900" onClick={bulkPrintPdf}>
                Print Pdf
              </Button>
            </div>
            <div className=" flex gap-5">
              <Select
                value={courierCus}
                onValueChange={(v) => setCourierCus(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Courier" />
                </SelectTrigger>
                <SelectContent>
                  {courierList.map((dis) => (
                    <SelectItem key={dis.serial} value={dis.name}>
                      {dis.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                onChange={(e) => setPhoneQuery(e.target.value)}
                name="phoneQuery"
                value={phoneQuery}
                placeholder="Search by phone"
                type="number"
              />
              <Link
                className=" bg-main_accent py-1.5 px-3 rounded-md text-sm text-white flex justify-center items-center"
                href={`/admin/orders?phone=${phoneQuery}`}
              >
                Submit
              </Link>
              <Button
                className=" bg-red-500"
                onClick={() => {
                  setCourierCus("");
                  setPhoneQuery("0");
                  router.push("/admin/orders");
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Input
                    type="checkbox"
                    className=" w-6 h-6"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const ids = orderData.map((o) => o.id);
                        setSelected(ids);
                      } else setSelected([]);
                    }}
                  />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Shipping Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>

                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData.map((o, i) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">
                    <Input
                      type="checkbox"
                      className=" w-6 h-6"
                      id={o.id}
                      checked={selected.includes(o.id)}
                      onChange={() => handleCheckboxChange(o.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{o.id}</TableCell>
                  <TableCell className="font-medium min-w-[300px]">
                    {o.products.map((p) => (
                      <div className=" flex flex-col gap-1" key={p.id}>
                        <div className=" flex gap-1 items-center justify-between">
                          <Image
                            src={
                              p.image?.length ? p.image[0].url : "/fallback.png"
                            }
                            width={60}
                            height={60}
                            alt="img"
                          />
                          <X size={18} />
                          <span>{p.quantity}</span>
                          <span>
                            Sub Total:{" "}
                            {(p.discountPrice ? p.discountPrice : p.price) *
                              p.quantity!}{" "}
                          </span>
                        </div>
                        <p>{p.name}</p>
                      </div>
                    ))}
                  </TableCell>

                  <TableCell className="font-medium">
                    <p>{o.customer.name}</p>
                    <p>{o.customer.phone}</p>
                    <p>{o.customer.address}</p>
                  </TableCell>
                  <TableCell>{o.shipping}</TableCell>
                  <TableCell>
                    <Select
                      value={o.status ?? "Pending"}
                      onValueChange={async (value) => {
                        // @ts-ignore
                        setOrdersData((prev) => {
                          const newVal = prev.map((val) => {
                            if (val.id === o.id)
                              return { ...val, status: value };
                            return val;
                          });
                          return newVal;
                        });
                        // @ts-ignore
                        await updateOrder({ ...o, status: value });
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-[130px] focus-visible:outline-none focus:outline-none",
                          o.status === "Delivered"
                            ? " bg-green-400"
                            : o.status === "Cancelled"
                            ? "bg-red-400"
                            : "bg-teal-400"
                        )}
                      >
                        <SelectValue placeholder="Order Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {orderStatusEnum.enumValues.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{o.note}</TableCell>
                  <TableCell>{o.payment}</TableCell>
                  <TableCell className="text-right">{o.total}</TableCell>
                  <TableCell className="text-right">
                    {new Date(o.createdAt!).toLocaleDateString()}
                  </TableCell>

                  <TableCell className=" flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setPdfData(() => [
                          {
                            createdAt: o.createdAt,
                            customer: o.customer,
                            id: o.id,
                            products: o.products,
                            total: o.total,
                            shipping: o.shipping,
                          },
                        ]);
                        setShowPdf(true);
                      }}
                    >
                      <PrinterIcon color="brown" size={22} />
                    </Button>
                    <Link
                      className=" px-4 py-2"
                      href={`/admin/orders/edit/${o.id}`}
                    >
                      <FileEditIcon className=" text-teal-600" size={22} />
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        const succ = await deleteOrderById(o.id);
                        if (succ) {
                          setOrdersData(
                            orderData.filter((order) => order.id !== o.id)
                          );
                          toast({
                            variant: "success",
                            title: "Deleted Order Successfully!",
                          });
                        } else
                          toast({
                            variant: "destructive",
                            title: "Error Occurred!",
                          });
                      }}
                    >
                      <DeleteIcon color="red" size={22} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default OrderAdmin;
