"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    large: string;
  };
  alt: string;
}

const fetchImages = async (query: string): Promise<PexelsPhoto[]> => {
  try {
    const res = await fetch(`/api/pexels?query=${query}`);

    if (!res.ok) throw new Error("Failed to fetch images");

    const data = await res.json();

    return data.photos || [];
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

export default function Gallery() {
  const [images, setImages] = useState<PexelsPhoto[]>([]);

  useEffect(() => {
    fetchImages("nature").then(setImages);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <div key={img.id} className="relative w-full h-64">
          <Image
            src={img.src.large}
            alt={img.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="rounded-lg shadow-lg"
          />
        </div>
      ))}
    </div>
  );
}
