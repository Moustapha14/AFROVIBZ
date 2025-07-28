'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const heroImages = [
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (1).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (2).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (3).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (4).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (5).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (6).jpeg',
  '/images/products/sac-hexagonal.jpg',
  '/images/products/sac-noir.jpg',
  '/images/products/sac-blanc.jpg',
  '/images/products/sac-rouge.jpg',
  '/images/products/sac-rose.jpg',
  '/images/products/sac-vert.jpg',
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change d'image toutes les 4 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={image}
            alt={`Image de fond ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index < 3}
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 via-orange-500/40 to-red-500/40"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      ))}
    </div>
  );
} 