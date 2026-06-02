'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RotatingFashionCardProps {
  title: string
  images: { src: string; alt: string }[]
}

export function RotatingFashionCard({ title, images }: RotatingFashionCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className='bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl h-72 flex items-center justify-center'>
        <p className='text-white/70'>No images</p>
      </div>
    )
  }

  return (
    <div className='relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden h-72 cursor-pointer group'>
      {/* Image */}
      <div className='absolute inset-0'>
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          prevImage()
        }}
        className='absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10'
      >
        <ChevronLeft className='w-5 h-5' />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          nextImage()
        }}
        className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10'
      >
        <ChevronRight className='w-5 h-5' />
      </button>

      {/* Title and Indicator */}
      <div className='absolute bottom-0 left-0 right-0 p-4'>
        <h3 className='text-lg font-semibold text-white mb-2'>{title}</h3>
        
        {/* Dot Indicators */}
        <div className='flex gap-1.5'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Click hint */}
      <div className='absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity'>
        Klik untuk lihat lainnya
      </div>
    </div>
  )
}