"use client";

import {
  deleteCategories,
  deleteCouriers,
  getAllCouriers,
  insertNewCouriers,
} from "@/actions/products";
import FullScreenModal from "@/components/FullScreenModal";
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
import { couriers } from "@/db/products.schema";
import { ArrowRight, DeleteIcon, FileEditIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

const AdminCourier = () => {
  const [courier, setCouriers] = useState<(typeof couriers.$inferSelect)[]>([]);
  const [newCouriers, setNewCouriers] = useState({
    name: "",
    charge: 0,
    city: false,
    zone: false,
    status: "Active",
  });
  const [edit, setEdit] = useState(false);

  const createNewCouriers = async () => {
    setEdit(false);
    const cat = await insertNewCouriers({
      name: newCouriers.name,
      status: newCouriers.status === "Active" ? true : false,
      charge: newCouriers.charge,
      city: newCouriers.city,
      zone: newCouriers.zone,
    });

    if (!cat)
      return toast({
        title: "Error Occurred!",
        variant: "destructive",
      });

    const filterNewCat = courier.filter((c) => c.name !== cat.name);
    setCouriers([...filterNewCat, cat].sort((a, b) => a.serial - b.serial));
    toast({
      title: "Success!",
      variant: "success",
    });
  };

  const [pending, startTransition] = useTransition();

  const initCat = async () => {
    startTransition(async () => {
      const cat = await getAllCouriers();
      if (cat) return setCouriers(cat);
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
      {edit && (
        <FullScreenModal<boolean> modalCloseValue={false} setModal={setEdit}>
          <div className=" flex flex-col gap-4 w-400px rounded-lg px-8 py-10 bg-slate-100">
            <div>
              <Label>Courier Name</Label>
              <Input
                value={newCouriers.name}
                onChange={(e) =>
                  setNewCouriers((prev) => ({ ...prev, name: e.target.value }))
                }
                name="name"
              />
            </div>
            <div>
              <Label>Courier Charge</Label>
              <Input
                value={newCouriers.charge}
                type="number"
                onChange={(e) =>
                  setNewCouriers((prev) => ({
                    ...prev,
                    charge: Number(e.target.value),
                  }))
                }
                name="charge"
              />
            </div>
            <div className=" flex flex-col gap-3 flex-wrap">
              <div className=" flex gap-2 items-center">
                <Input
                  className=" w-6"
                  id="city"
                  checked={newCouriers.city}
                  value={0}
                  type="checkbox"
                  name="city"
                  onChange={(e) => {
                    if (e.target.checked)
                      return setNewCouriers((prev) => ({
                        ...prev,
                        city: true,
                      }));

                    setNewCouriers((prev) => ({ ...prev, city: false }));
                  }}
                />
                <Label htmlFor="city">City Available</Label>
              </div>
              <div className=" flex gap-2 items-center">
                <Input
                  checked={newCouriers.zone}
                  className=" w-6"
                  value={0}
                  type="checkbox"
                  name="zone"
                  id="zone"
                  onChange={(e) => {
                    if (e.target.checked)
                      return setNewCouriers((prev) => ({
                        ...prev,
                        zone: true,
                      }));

                    setNewCouriers((prev) => ({ ...prev, zone: false }));
                  }}
                />
                <Label htmlFor="zone">Zone Available</Label>
              </div>
            </div>
            <div className=" z-[9999] flex flex-col gap-1">
              <Label>Couriers Status</Label>
              <select
                className=" px-3 py-2.5 rounded-md border"
                value={newCouriers.status}
                onChange={(e) => {
                  setNewCouriers((prev) => ({
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
            <Button onClick={createNewCouriers}>Submit</Button>
          </div>
        </FullScreenModal>
      )}
      <div className=" flex text-xs gap-2 font-semibold items-center">
        <Link href="/admin">Home</Link>
        <ArrowRight size={15} />
        <span className=" text-main_accent">Couriers</span>
      </div>
      <h1 className="text-xl font-semibold  mt-2 mb-4 text-main_accent">
        Categories
      </h1>
      <Button onClick={() => setEdit(true)}>Add New Couriers</Button>
      <Table className=" mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SL.</TableHead>
            <TableHead>Courier Name</TableHead>
            <TableHead>Charge</TableHead>
            <TableHead>City Available</TableHead>
            <TableHead>Zone Available</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courier.map((cat) => (
            <TableRow key={cat.serial}>
              <TableCell className="font-medium">{cat.serial}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.charge}</TableCell>
              <TableCell>{cat.city ? "ON" : "OFF"}</TableCell>
              <TableCell>{cat.zone ? "ON" : "OFF"}</TableCell>

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
                    setNewCouriers({
                      charge: cat.charge,
                      city: cat.city,
                      zone: cat.zone,
                      name: cat.name,
                      status: cat.status ? "Active" : "InActive",
                    });
                  }}
                  variant="ghost"
                >
                  <FileEditIcon size={18} color="orange" />
                </Button>
                <Button
                  onClick={async () => {
                    const suc = await deleteCouriers(cat.name);
                    if (suc) {
                      const filter = courier.filter((c) => c.name !== cat.name);
                      setCouriers(() => filter);
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

export default AdminCourier;
