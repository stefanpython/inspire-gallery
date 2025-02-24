// components/Gallery/ImageCard.tsx
"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useState } from "react";

interface ImageCardProps {
  photo: {
    id: number;
    src: {
      medium: string;
      large: string;
      original: string;
    };
    alt: string;
  };
}

export default function ImageCard({ photo }: ImageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.src.original);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pexels-photo-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <div
        className="relative w-full h-64 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={photo.src.large}
          alt={photo.alt}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-5xl h-full max-h-[90vh] m-4 bg-white rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-20 z-10 p-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="absolute top-4 right-4 z-10 p-2 text-gray-600 hover:text-gray-800"
            >
              <Download className="w-6 h-6" />
            </button>

            {/* Image container */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full">
                <Image
                  src={photo.src.large}
                  alt={photo.alt}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
