"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

import Autoplay from "embla-carousel-autoplay";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { getAllSliders } from "@/actions/products";
import { sliders } from "@/db/products.schema";
import { cn } from "@/lib/utils";

const HomeFeaturedCarousel = () => {
  const [images, setImages] = useState<(typeof sliders.$inferSelect)[]>([]);
  const [loading, setLoading] = useTransition();
  const fetchImages = async () => {
    startTransition(async () => {
      const images = await getAllSliders(true);
      if (images) setImages([...images]);
    });
  };
  useEffect(() => {
    fetchImages();
  }, []);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className={cn(
        " min-w-full md:mt-6 lg:min-h-[300px]",
        loading ? "animate-pulse" : "animate-none"
      )}
      opts={{
        loop: true,
      }}
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="min-w-full">
        {images.map((img) => {
          return (
            <CarouselItem
              key={img.id}
              className="w-full flex justify-center items-center "
            >
              <Image
                src={img.image}
                alt="featured"
                width={1500}
                height={300}
                className=" max-h-[300px] min-w-full object-cover"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default HomeFeaturedCarousel;
