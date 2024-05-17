"use client";

import {
  deleteCategories,
  getAllCategories,
  insertNewCategory,
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
import { categories } from "@/db/products.schema";
import { ArrowRight, DeleteIcon, FileEditIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

const AdminCategory = () => {
  const [category, setCategory] = useState<(typeof categories.$inferSelect)[]>(
    []
  );
  const [newCategory, setNewCategory] = useState({
    name: "",
    status: "Active",
  });
  const [edit, setEdit] = useState(false);

  const createNewCategory = async () => {
    setEdit(false);
    const cat = await insertNewCategory({
      category: newCategory.name,
      status: newCategory.status === "Active" ? true : false,
    });

    if (!cat)
      return toast({
        title: "Error Occurred!",
        variant: "destructive",
      });

    const filterNewCat = category.filter((c) => c.category !== cat.category);
    setCategory([...filterNewCat, cat].sort((a, b) => a.serial - b.serial));
    toast({
      title: "Success!",
      variant: "success",
    });
  };

  const [pending, startTransition] = useTransition();

  const initCat = async () => {
    startTransition(async () => {
      const cat = await getAllCategories();
      if (cat) return setCategory(cat);
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
              <Label>Category Name</Label>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                name="category"
              />
            </div>
            <div className=" z-[9999] flex flex-col gap-1">
              <Label>Category Status</Label>
              <select
                className=" px-3 py-2.5 rounded-md border"
                value={newCategory.status}
                onChange={(e) => {
                  setNewCategory((prev) => ({
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
            <Button onClick={createNewCategory}>Submit</Button>
          </div>
        </FullScreenModal>
      )}
      <div className=" flex text-xs gap-2 font-semibold items-center">
        <Link href="/admin">Home</Link>
        <ArrowRight size={15} />
        <span className=" text-main_accent">Category</span>
      </div>
      <h1 className="text-xl font-semibold  mt-2 mb-4 text-main_accent">
        Categories
      </h1>
      <Button onClick={() => setEdit(true)}>Add New Category</Button>
      <Table className=" mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SL.</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {category.map((cat) => (
            <TableRow key={cat.serial}>
              <TableCell className="font-medium">{cat.serial}</TableCell>
              <TableCell>{cat.category}</TableCell>
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
                    setNewCategory({
                      name: cat.category,
                      status: cat.status ? "Active" : "InActive",
                    });
                  }}
                  variant="ghost"
                >
                  <FileEditIcon size={18} color="orange" />
                </Button>
                <Button
                  onClick={async () => {
                    const suc = await deleteCategories(cat.category);
                    if (suc) {
                      const filter = category.filter(
                        (c) => c.category !== cat.category
                      );
                      setCategory(() => filter);
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

export default AdminCategory;
