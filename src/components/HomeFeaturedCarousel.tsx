"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { getAllSliders } from "@/actions/products";
import { sliders } from "@/db/products.schema";

const HomeFeaturedCarousel = () => {
  const [images, setImages] = useState<(typeof sliders.$inferSelect)[]>([]);
  const fetchImages = async () => {
    const images = await getAllSliders(true);
    if (images) setImages([...images]);
  };
  useEffect(() => {
    fetchImages();
  }, []);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className=" min-w-full mt-6"
      opts={{
        loop: true,
      }}
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className=" ">
        {images.map((img) => {
          return (
            <CarouselItem key={img.id} className=" flex justify-center ">
              <Image
                src={img.image}
                alt="featured"
                width={1500}
                height={320}
                className=" max-h-[320px] w-full object-cover"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default HomeFeaturedCarousel;
