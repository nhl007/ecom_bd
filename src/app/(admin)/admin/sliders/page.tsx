"use client";

import {
  deleteSliders,
  getAllSliders,
  insertNewSlider,
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
import { sliders } from "@/db/products.schema";
import { ArrowRight, DeleteIcon, FileEditIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

const AdminSliders = () => {
  const [slider, setSlider] = useState<(typeof sliders.$inferSelect)[]>([]);
  const [newSlider, setNewSlider] = useState({
    image: "",
    id: "",
    status: "Active",
  });
  const [edit, setEdit] = useState(false);

  const createNewSlider = async () => {
    const cat = await insertNewSlider({
      id: newSlider.id,
      image: newSlider.image,
      status: newSlider.status === "Active" ? true : false,
    });
    setEdit(false);

    if (!cat)
      return toast({
        title: "Error Occurred!",
        variant: "destructive",
      });

    const filterNewCat = slider.filter((c) => c.id !== cat.id);
    setSlider([...filterNewCat, cat].sort((a, b) => a.serial - b.serial));
    toast({
      title: "Success!",
      variant: "success",
    });
  };

  const [pending, startTransition] = useTransition();

  const initCat = async () => {
    startTransition(async () => {
      const cat = await getAllSliders();
      if (cat) return setSlider(cat);
      toast({
        title: "Error Occurred!",
        variant: "destructive",
      });
    });
  };

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileData = e.target.files ? e.target.files[0] : null;
    if (!fileData) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(fileData);
    fileReader.onloadend = () => {
      setNewSlider((prev) => ({
        ...prev,
        image: fileReader.result as string,
      }));
    };
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
              {newSlider.image ? (
                <Image
                  alt="slider"
                  src={newSlider.image ?? "/fallback.png"}
                  width={300}
                  height={100}
                  className=" max-h-[300px] mb-4 object-contain"
                />
              ) : null}
              <Label>Slider Image</Label>
              <Input type="file" name="slider" onChange={imageHandler} />
            </div>
            <div className=" z-[9999] flex flex-col gap-1">
              <Label>Slider Status</Label>
              <select
                className=" px-3 py-2.5 rounded-md border"
                value={newSlider.status}
                onChange={(e) => {
                  setNewSlider((prev) => ({
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
            <Button onClick={createNewSlider}>Submit</Button>
          </div>
        </FullScreenModal>
      )}
      <div className=" flex text-xs gap-2 font-semibold items-center">
        <Link href="/admin">Home</Link>
        <ArrowRight size={15} />
        <span className=" text-main_accent">Slider</span>
      </div>
      <h1 className="text-xl font-semibold  mt-2 mb-4 text-main_accent">
        Sliders
      </h1>
      <Button onClick={() => setEdit(true)}>Add New Slider</Button>
      <Table className=" mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SL.</TableHead>
            <TableHead>Slider Id</TableHead>
            <TableHead>Slider Image</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slider.map((cat) => (
            <TableRow key={cat.serial}>
              <TableCell className="font-medium">{cat.serial}</TableCell>
              <TableCell>{cat.id}</TableCell>
              <TableCell>
                <Image
                  alt="slider"
                  src={cat.image}
                  width={300}
                  height={100}
                  className=" max-h-[120px] object-contain"
                />
              </TableCell>

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
              <TableCell className="flex gap-1 items-center">
                <Button
                  onClick={() => {
                    setEdit(true);
                    setNewSlider({
                      id: cat.id,
                      image: cat.image,
                      status: cat.status ? "Active" : "InActive",
                    });
                  }}
                  variant="ghost"
                >
                  <FileEditIcon size={18} color="orange" />
                </Button>
                <Button
                  onClick={async () => {
                    const suc = await deleteSliders(cat.id);
                    if (suc) {
                      const filter = slider.filter((c) => c.id !== cat.id);
                      setSlider(() => filter);
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

export default AdminSliders;
