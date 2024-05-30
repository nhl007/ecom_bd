"use client";

import { uploadImage } from "@/actions/cloudinary";
import {
  getPixelCode,
  getPreferences,
  setPreferences,
} from "@/actions/preference";
import LoadingSpinner from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

const Settings = () => {
  const [pending, startTran] = useTransition();
  useEffect(() => {
    const set = async () => {
      startTran(async () => {
        const data = await getPreferences();
        if (!data) return;
        setPhone(data.phone);
        setAddress(data.address);
        setCopyRight(data.copyright);
        setImage(data.logo);
        const pixel = await getPixelCode();
        if (pixel) setPixel(pixel);
      });
    };
    set();
  }, []);

  const [pixel, setPixel] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [copyright, setCopyRight] = useState("");
  const [image, setImage] = useState({
    id: "",
    url: "",
  });

  const { toast } = useToast();

  const submitPixelCode = async () => {
    let img = image;

    startTran(async () => {
      if (imagePreview) {
        const res = await uploadImage(imagePreview);
        if (res) {
          img = {
            id: res.id,
            url: res?.url!,
          };
        }
      }
      const data = await setPreferences({
        address: address,
        phone: phone,
        pixelScript: pixel,
        copyRight: copyright,
        logo: img,
      });
      // const data = true;
      if (!data)
        toast({
          title: "Error",
          variant: "destructive",
        });
      else
        toast({
          title: "Settings updated!",
          variant: "success",
        });
    });
  };

  const [imagePreview, setImagePreview] = useState<string>();

  const imagePreviewHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileData = e.target.files;
    if (!fileData) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(fileData[0]);
    fileReader.onloadend = () => {
      setImagePreview(fileReader.result as string);
    };
  };

  return (
    <div className=" flex flex-col gap-4">
      {pending && <LoadingSpinner />}
      <div>
        <Label>Website Logo</Label>

        <div className=" flex gap-4 items-center">
          <Input
            onChange={imagePreviewHandler}
            accept=".svg,.png,.jpg"
            type="file"
            className=" max-w-[300px]"
          />
          <div className=" relative">
            <Image
              src={imagePreview ? imagePreview : image.url}
              alt="img"
              width={100}
              height={100}
              className=" max-w-[100px] h-[80px] cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div>
        <Label>Phone Number</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className=" focus-visible:outline-none border-2 w-full"
          placeholder="Enter Primary Contact Number"
        />
      </div>

      <div>
        <Label>Address</Label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className=" focus-visible:outline-none border-2 w-full"
          placeholder="Enter Footer Address"
          rows={3}
        />
      </div>
      <div>
        <Label>Copy Right Text</Label>
        <textarea
          value={copyright}
          onChange={(e) => setCopyRight(e.target.value)}
          className=" focus-visible:outline-none border-2 w-full"
          placeholder="Enter Copyright Text"
          rows={2}
        />
      </div>
      <div>
        <Label>Pixel CODE</Label>
        <textarea
          value={pixel}
          onChange={(e) => setPixel(e.target.value)}
          className=" focus-visible:outline-none border-2 w-full"
          placeholder="Pixel Api key"
          rows={6}
        />
      </div>
      <Button
        loader={pending}
        disabled={pending}
        onClick={() => submitPixelCode()}
      >
        Save
      </Button>
    </div>
  );
};

export default Settings;
