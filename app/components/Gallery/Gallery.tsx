// components/Gallery/Gallery.tsx
"use client";

import { useState, useEffect } from "react";
import ImageCard from "./ImageCard";

interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    large: string;
    original: string;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {images.map((photo) => (
        <ImageCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}
