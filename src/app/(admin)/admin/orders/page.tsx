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
  | "Pending Delivery"
  | "Cancelled"
  | "Delivered"
  | "Hold"
  | "Processing"
  | "Pending Payment"
  | "Entry";

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

import { CSVLink } from "react-csv";
import { getAllUsersName } from "@/actions/authentication";

type IReactPdfDoc = Pick<
  typeof orders.$inferSelect,
  | "createdAt"
  | "customer"
  | "total"
  | "shipping"
  | "products"
  | "invoice"
  | "delivery"
  | "discount"
>;

type IReactExcelDoc = {
  invoice: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount: number;
  created_at: string;
  products: string;
  assigned_to: string;
  courier: string;
  shipping: string;
};

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
    "Pending Payment": 0,
    Cancelled: 0,
    Delivered: 0,
    Hold: 0,
    Processing: 0,
    "Pending Delivery": 0,
    Entry: 0,
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
    const entry = searchP.get("entry");

    startTransition(async () => {
      const courier = await getAllCouriers();

      if (courier) setCourierList(courier);

      const ord = await filterOrders({
        courier: courierCus,
        phone: phone,
        pendingEntry: !!entry ? true : false,
        // @ts-ignore
        status: [
          "Delivered",
          "Pending Payment",
          "Cancelled",
          "Hold",
          "Processing",
          "Pending Delivery",
          "Entry",
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
    orderLoad();
  }, [orderLoad]);

  useEffect(() => {
    const orderDataInit = async () => {
      const da = await getOrderData();

      if (!da)
        return setDash(() => {
          return {
            Order: 0,
            Delivered: 0,
            Cancelled: 0,
            Hold: 0,
            Processing: 0,
            "Pending Delivery": 0,
            "Pending Payment": 0,
            Entry: 0,
          };
        });
      setDash(() => {
        return {
          Order: da.Order,
          Delivered: da.Completed,
          Cancelled: da.Cancelled,
          "Pending Delivery": da["Pending Delivery"],
          "Pending Payment": da.Pending,
          Hold: da.Hold,
          Processing: da.Processing,
          Entry: da.Entry,
        };
      });
    };

    orderDataInit();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelected((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((checkedId) => checkedId !== id);
      } else {
        return [...prevState, id];
      }
    });

    const data = orderData.find((data) => data.id === id);
    if (!data) return;
    const productName = data.products
      .map((v) => v.name + `(${v.quantity})`)
      .join(", ");
    setCsvData((prev) => [
      ...prev,
      {
        created_at: String(data.createdAt),
        assigned_to: "hello",
        customer_address: data.customer.address,
        customer_name: data.customer.name,
        customer_phone: data.customer.phone,
        courier: data.courier ?? "",
        invoice: data.id,
        products: productName,
        shipping: data.shipping ?? "",
        amount: data.total,
      },
    ]);
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

  const [csvData, setCsvData] = useState<IReactExcelDoc[]>([]);

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

  const [userList, setUserList] = useState(["string"]);

  const getAllUsersList = async () => {
    const users = await getAllUsersName();
    if (!users) return;
    setUserList(users.map((u) => u.name));
  };

  useEffect(() => {
    getAllUsersList();
  }, []);

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
              <Link
                key={d}
                href={`/admin/orders?status=${
                  d === "Pending"
                    ? d + " Payment"
                    : d === "Entry"
                    ? "null&entry=true"
                    : d
                }`}
              >
                <AdminDashBoardInfoBox
                  name={
                    d === "Entry"
                      ? "Pending Entry"
                      : "Total " + d + (d === "Pending" ? " Payment" : "")
                  }
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

          <div className=" flex justify-between mt-4 mb-6 items-center">
            <div className="  flex gap-3">
              <Link
                className=" py-2 px-3 text-sm bg-amber-800 hover:bg-main_accent rounded-md text-white"
                href="/admin/orders/create"
              >
                Add Order
              </Link>
              <Button
                size="sm"
                className=" bg-blue-950"
                onClick={bulkUpdateSteadFast}
              >
                Stead Fast Export
              </Button>
              <Button size="sm" className="bg-teal-900" onClick={bulkPrintPdf}>
                Print invoice
              </Button>
              <CSVLink
                className=" text-sm bg-lime-700 text-white px-3 py-2 rounded-sm"
                data={csvData}
                filename="oasis.xls"
                onClick={() => {
                  if (csvData.length === 0) {
                    toast({
                      title: "Please select a row first",
                      variant: "destructive",
                    });
                    return false;
                  }
                }}
              >
                Export Excel
              </CSVLink>
            </div>
            <div className=" flex gap-3">
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

                        const data = orderData
                          .filter((data) => ids.includes(data.id))
                          .map((or) => {
                            const productName = or.products
                              .map((v) => v.name + `(${v.quantity})`)
                              .join(", ");

                            return {
                              created_at: String(or.createdAt),
                              assigned_to: "hello",
                              customer_address: or.customer.address,
                              customer_name: or.customer.name,
                              customer_phone: or.customer.phone,
                              courier: or.courier ?? "",
                              invoice: or.id,
                              products: productName,
                              shipping: or.shipping ?? "",
                              amount: or.total,
                            };
                          });
                        setCsvData(data);
                      } else setSelected([]);
                    }}
                  />
                </TableHead>
                <TableHead>SI.</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer Info</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Created At</TableHead>
                <TableHead className="text-right">Assigned</TableHead>

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
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell className="font-medium">{o.invoice}</TableCell>
                  <TableCell className="font-medium">
                    <p>{o.customer.name}</p>
                    <p>{o.customer.phone}</p>
                    <p>{o.customer.address}</p>
                  </TableCell>
                  <TableCell className="font-medium">
                    {o.products.map((p) => (
                      <div className=" flex gap-2" key={p.id}>
                        <span>{p.quantity}</span>
                        <X size={18} />
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </TableCell>

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
                  <TableCell className="text-right">{o.total}</TableCell>

                  <TableCell className="text-right">
                    {new Date(o.createdAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={o.assigned?.trim() ?? ""}
                      onValueChange={async (value) => {
                        // @ts-ignore
                        setOrdersData((prev) => {
                          const newVal = prev.map((val) => {
                            if (val.id === o.id)
                              return { ...val, assigned: value };
                            return val;
                          });
                          return newVal;
                        });
                        // @ts-ignore
                        await updateOrder({ ...o, assigned: value });
                        console.log(value);
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "focus-visible:outline-none focus:outline-none max-w-fit"
                        )}
                      >
                        <SelectValue placeholder="Assign Order To:" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {userList.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className=" flex flex-col justify-center items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setPdfData(() => [
                          {
                            createdAt: o.createdAt,
                            customer: o.customer,
                            invoice: o.invoice,
                            products: o.products,
                            total: o.total,
                            shipping: o.shipping,
                            delivery: o.delivery,
                            discount: o.discount,
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
