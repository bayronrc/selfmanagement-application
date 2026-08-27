"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    alt: "Hospital moderno",
    caption: "Instalaciones de última generación",
  },
  {
    src: "https://images.unsplash.com/photo-1551190822-a9ce113dc862?w=800&q=80",
    alt: "Doctor con estetoscopio",
    caption: "Profesionales altamente capacitados",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    alt: "Consulta médica",
    caption: "Atención personalizada",
  },
  {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    alt: "Laboratorio",
    caption: "Tecnología de vanguardia",
  },
  {
    src: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&q=80",
    alt: "Equipo médico",
    caption: "Diagnóstico preciso",
  },
  {
    src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
    alt: "Farmacia",
    caption: "Medicamentos certificados",
  },
]

const INTERVAL = 4000

export function MedicalCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % IMAGES.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + IMAGES.length) % IMAGES.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, INTERVAL)
    return () => clearInterval(timer)
  }, [isPaused, next])

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-3xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {IMAGES.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            i === current
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-105 z-0"
          }`}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
        <p className="text-white text-lg md:text-xl font-semibold drop-shadow-lg">
          {IMAGES[current].caption}
        </p>
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 hover:text-white transition-all"
        onClick={prev}
      >
        <ChevronLeftIcon className="size-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 hover:text-white transition-all"
        onClick={next}
      >
        <ChevronRightIcon className="size-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 flex gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
