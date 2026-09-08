"use client"

import Image from "next/image"

const IMAGES = [
  { src: "/img/img-6.jpg", alt: "Imagen 6" },
  { src: "/img/img-5.jpg", alt: "Imagen 5" },
  { src: "/img/img-7.webp", alt: "Imagen 7" },
]

export function MedicalCarousel() {
  return (
    <div className="w-full h-[200px] md:h-[260px] lg:h-[340px] overflow-hidden">
      <div className="grid grid-cols-3 h-full gap-2 md:gap-3">
        {IMAGES.map((img, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-lg ${
              i === 0
                ? "md:col-span-1 col-span-1"
                : ""
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 33vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}