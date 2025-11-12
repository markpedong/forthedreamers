"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image with Magnifier */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
        <div
          ref={containerRef}
          className="relative aspect-square cursor-zoom-in"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={images[selectedIndex] || "/placeholder.svg"}
            alt="Product image"
            fill
            className="object-cover"
            priority
          />

          {isHovering && (
            <div
              className="absolute pointer-events-none"
              style={{
                width: "150px",
                height: "150px",
                left: `${mousePosition.x - 75}px`,
                top: `${mousePosition.y - 75}px`,
                border: "2px solid rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(2px)",
                boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.05)",
                transition: "all 0.1s ease-out",
              }}
            >
              {/* Zoomed image inside magnifier */}
              <div
                className="absolute w-full h-full overflow-hidden rounded-[6px]"
                style={{
                  backgroundImage: `url(${images[selectedIndex]})`,
                  backgroundSize: "300%",
                  backgroundPosition: `${(mousePosition.x / containerRef.current?.offsetWidth!) * 100}% ${(mousePosition.y / containerRef.current?.offsetHeight!) * 100}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={handlePrevious}
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={handleNext}
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
              selectedIndex === index ? "border-primary" : "border-border hover:border-muted-foreground"
            }`}
          >
            <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
