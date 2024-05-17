"use client";

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
        const pixel = await getPixelCode();
        if (pixel) setPixel(pixel);
      });
    };
    set();
  }, []);

  const [pixel, setPixel] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { toast } = useToast();

  const submitPixelCode = async () => {
    const data = await setPreferences({
      address: address,
      phone: phone,
      pixelScript: pixel,
    });
    // const data = true;
    if (!data)
      return toast({
        title: "Error",
        variant: "destructive",
      });

    toast({
      title: "Settings updated!",
      variant: "success",
    });
  };

  return (
    <div className=" flex flex-col gap-4">
      {pending && <LoadingSpinner />}
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
        <Label>Pixel CODE</Label>
        <textarea
          value={pixel}
          onChange={(e) => setPixel(e.target.value)}
          className=" focus-visible:outline-none border-2 w-full"
          placeholder="Pixel Api key"
          rows={6}
        />
      </div>
      <Button onClick={() => submitPixelCode()}>Save</Button>
    </div>
  );
};

export default Settings;
