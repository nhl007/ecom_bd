"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { useRef } from "react";

const ProductCarousel = ({
  images,
}: {
  images: { url: string; id: string }[];
}) => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <>
      <Carousel
        plugins={[plugin.current]}
        opts={{
          loop: true,
        }}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
        className="min-w-full mt-4 "
      >
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem key={i} className=" flex justify-center">
              <Image
                src={img.url}
                alt="prod"
                width={500}
                height={500}
                className=" w-full h-auto max-h-[300px] md:max-h-[400px] object-cover rounded-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default ProductCarousel;
