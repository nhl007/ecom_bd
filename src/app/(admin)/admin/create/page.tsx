"use client";

import { uploadImage } from "@/actions/cloudinary";
import { createNewProducts, getAllCategories } from "@/actions/products";
import FullScreenModal from "@/components/FullScreenModal";
import QuillTextEditor from "@/components/QuillTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { categories, products } from "@/db/products.schema";
import { calculateDiscountPercentage } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Create = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [des, setDes] = useState("<p>Write your product description here</p>");

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [imageFullScreen, setImageFullScreen] = useState<string | null>(null);

  const [product, setProduct] = useState<typeof products.$inferInsert>({
    price: 0,
    category: "",
    stock: 0,
    name: "",
    discountPrice: 0,
    discountPercentage: 0,
    image: [],
    description: "",
    status: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const percentage = calculateDiscountPercentage(
      product.price,
      product.discountPrice ? product.discountPrice : 0
    );
    setProduct({ ...product, discountPercentage: percentage });
  }, [product.price, product.discountPrice]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name)
      return toast({
        title: "Error!",
        description: "Name is required!",
        variant: "destructive",
      });

    if (!des)
      return toast({
        title: "Error!",
        description: "Description is required!",
        variant: "destructive",
      });

    if (product.price <= 0)
      return toast({
        title: "Error!",
        description: "Invalid Product Price!",
        variant: "destructive",
      });

    if (product.stock <= 0)
      return toast({
        title: "Error!",
        description: "Invalid Stock!",
        variant: "destructive",
      });

    setIsLoading(true);

    const image: { id: string; url: string }[] = [];
    if (imagePreview.length) {
      for (const img of imagePreview) {
        const res = await uploadImage(img);
        if (res) image.push(res);
      }
    }

    const p = { ...product, description: des, image: image };

    const data = await createNewProducts(p);

    setIsLoading(false);
    if (data.success) {
      toast({
        title: "Product created",
        description: data.message,
        variant: "success",
      });
    } else
      toast({
        title: "Error Occurred!",
        description: data.message,
        variant: "destructive",
      });
  };

  const imagePreviewHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileData = e.target.files;
    if (!fileData) return;

    for (const file of fileData) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        setImagePreview((prev) => [...prev, fileReader.result as string]);
      };
    }
  };

  const [categoriesList, setCategoriesList] = useState<
    (typeof categories.$inferSelect)[]
  >([]);

  useEffect(() => {
    const init = async () => {
      const cat = await getAllCategories(true);
      if (cat) setCategoriesList(cat);
    };

    init();
  }, []);

  return (
    <div>
      {imageFullScreen && (
        <FullScreenModal<string | null>
          modalCloseValue={null}
          setModal={setImageFullScreen}
        >
          <Image
            src={imageFullScreen}
            width={800}
            height={800}
            alt="img"
            className=" w-[800px] h-auto object-cover"
          />
        </FullScreenModal>
      )}
      <h1 className="text-2xl mt-6 text-BBlue1 font-semibold mb-3">
        Add a new product
      </h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-y-4 mt-10">
        <div className=" flex flex-col gap-1">
          <label className=" font-medium">Product Name : </label>
          <Input
            className=" w-[400px] border-gray-400"
            name="name"
            type="text"
            value={product.name}
            onChange={handleChange}
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label className=" font-medium">Product Price : </label>
          <Input
            className=" w-[400px] border-gray-400"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label className=" font-medium">Product Stock : </label>
          <Input
            className=" w-[400px] border-gray-400"
            name="stock"
            value={product.stock}
            type="number"
            onChange={handleChange}
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label className=" font-medium">Product Discount Price : </label>
          <Input
            className=" w-[400px] border-gray-400"
            name="discountPrice"
            type="number"
            value={product.discountPrice ?? 0}
            onChange={handleChange}
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label className=" font-medium">Product Discount Percentage : </label>
          <Input
            className=" w-[400px] border-gray-400"
            name="discountPercentage"
            type="number"
            value={product.discountPercentage ?? 0}
            onChange={handleChange}
          />
        </div>

        <div className=" flex gap-1 flex-col">
          <label>Category : </label>
          <select
            className=" max-w-[233px] py-2 border-gray-400 border-[1px] px-2 rounded-md focus-visible:border-black outline-none"
            onChange={(e) =>
              setProduct({
                ...product,
                category: e.target.value,
              })
            }
            value={product.category}
          >
            {categoriesList.map((option) => {
              return (
                <option key={option.category} value={option.category}>
                  {option.category}
                </option>
              );
            })}
          </select>
        </div>
        <div className=" w-fit">
          <Select
            value={product.status ? "Publish" : "UnPublish"}
            onValueChange={(v) =>
              setProduct((prev) => ({
                ...prev,
                status: v === "Publish" ? true : false,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"Publish"}>Publish</SelectItem>
              <SelectItem value={"UnPublish"}>UnPublish</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className=" col-span-2 flex flex-col gap-1">
          <label className=" font-medium">Upload Image: </label>
          <div className=" flex gap-4 items-center">
            <Input
              onChange={imagePreviewHandler}
              multiple
              accept=".svg,.png,.jpg"
              type="file"
              className=" max-w-[300px]"
            />
            {imagePreview.map((img, i) => (
              <div key={i} className=" relative">
                <Image
                  src={img}
                  alt="img"
                  width={100}
                  height={100}
                  onClick={() => setImageFullScreen(img)}
                  className=" max-w-[100px] h-[80px] cursor-pointer"
                />

                <X
                  onClick={() => {
                    const newImages = imagePreview.filter((_, im) => im !== i);
                    setImagePreview(newImages);
                  }}
                  color="red"
                  className=" absolute -top-6 -right-2 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className=" font-medium">Product Description: </label>
          <QuillTextEditor html={des} setHtml={setDes} />
        </div>

        <Button
          className=" w-[100px] mb-10"
          type="submit"
          loader={isLoading}
          disabled={isLoading}
        >
          Create
        </Button>
      </form>
    </div>
  );
};

export default Create;
