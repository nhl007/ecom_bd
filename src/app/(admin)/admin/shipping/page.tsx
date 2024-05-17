"use client";

import {
  deleteShipping,
  getAllShipping,
  insertNewShipping,
} from "@/actions/preference";
import FullScreenModal from "@/components/FullScreenModal";
import LoadingSpinner from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { shipping } from "@/db/preferences.schema";
import { ArrowRight, DeleteIcon, FileEditIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

const AdminShipping = () => {
  const [shippingList, setShippingList] = useState<
    (typeof shipping.$inferSelect)[]
  >([]);
  const [newShipping, setNewShipping] = useState({
    name: "",
    cost: 0,
    status: "Active",
  });
  const [edit, setEdit] = useState(false);

  const createNewShipping = async () => {
    setEdit(false);
    const cat = await insertNewShipping({
      name: newShipping.name,
      cost: newShipping.cost,
      status: newShipping.status === "Active" ? true : false,
    });

    if (!cat)
      return toast({
        title: "Error Occurred!",
        variant: "destructive",
      });

    const filterNewCat = shippingList.filter((c) => c.name !== cat.name);
    setShippingList([...filterNewCat, cat].sort((a, b) => a.serial - b.serial));
    toast({
      title: "Success!",
      variant: "success",
    });
  };

  const [pending, startTransition] = useTransition();

  const initCat = async () => {
    startTransition(async () => {
      const cat = await getAllShipping();
      if (cat) return setShippingList(cat);
      toast({
        title: "Error Occurred!",
        variant: "destructive",
      });
    });
  };

  useEffect(() => {
    initCat();
  }, []);

  return (
    <div>
      {pending && <LoadingSpinner />}
      {edit && (
        <FullScreenModal<boolean> modalCloseValue={false} setModal={setEdit}>
          <div className=" flex flex-col gap-4 w-400px rounded-lg px-8 py-10 bg-slate-100">
            <div>
              <Label>Shipping Name</Label>
              <Input
                value={newShipping.name}
                onChange={(e) =>
                  setNewShipping((prev) => ({ ...prev, name: e.target.value }))
                }
                name="shipping"
              />
            </div>
            <div>
              <Label>Shipping Cost</Label>
              <Input
                value={newShipping.cost}
                onChange={(e) =>
                  setNewShipping((prev) => ({
                    ...prev,
                    cost: Number(e.target.value),
                  }))
                }
                type="number"
                name="shipping"
              />
            </div>
            <div className=" z-[9999] flex flex-col gap-1">
              <Label>Shipping Status</Label>
              <select
                className=" px-3 py-2.5 rounded-md border"
                value={newShipping.status}
                onChange={(e) => {
                  setNewShipping((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }));
                }}
              >
                <option value={"Active"} selected>
                  Active
                </option>
                <option value={"InActive"}>InActive</option>
              </select>
            </div>
            <Button onClick={createNewShipping}>Submit</Button>
          </div>
        </FullScreenModal>
      )}
      <div className=" flex text-xs gap-2 font-semibold items-center">
        <Link href="/admin">Home</Link>
        <ArrowRight size={15} />
        <span className=" text-main_accent">Shipping</span>
      </div>
      <h1 className="text-xl font-semibold  mt-2 mb-4 text-main_accent">
        Shipping Methods
      </h1>
      <Button onClick={() => setEdit(true)}>Add New Shipping</Button>
      <Table className=" mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SL.</TableHead>
            <TableHead>Shipping Name</TableHead>
            <TableHead>Shipping Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shippingList.map((cat) => (
            <TableRow key={cat.serial}>
              <TableCell className="font-medium">{cat.serial}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.cost}</TableCell>
              <TableCell>
                {cat.status ? (
                  <span className=" py-1 px-4 rounded-sm bg-green-500 text-white">
                    Active
                  </span>
                ) : (
                  <span className=" py-1 px-4 rounded-sm bg-red-500 text-white">
                    InActive
                  </span>
                )}
              </TableCell>
              <TableCell className="flex gap-1 items-center ">
                <Button
                  onClick={() => {
                    setEdit(true);
                    setNewShipping({
                      name: cat.name,
                      cost: cat.cost,
                      status: cat.status ? "Active" : "InActive",
                    });
                  }}
                  variant="ghost"
                >
                  <FileEditIcon size={18} color="orange" />
                </Button>
                <Button
                  onClick={async () => {
                    const suc = await deleteShipping(cat.name);
                    if (suc) {
                      const filter = shippingList.filter(
                        (c) => c.name !== cat.name
                      );
                      setShippingList(() => filter);
                    } else
                      return toast({
                        title: "Error Occurred!",
                        variant: "destructive",
                      });
                  }}
                  variant="ghost"
                >
                  <DeleteIcon size={18} color="red" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminShipping;
