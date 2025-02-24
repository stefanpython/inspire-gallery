// components/Gallery/Gallery.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
}

export default function Gallery() {
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("nature"); // You can make this dynamic later

  const fetchImages = async (pageNumber: number): Promise<PexelsResponse> => {
    const res = await fetch(
      `/api/pexels?query=${query}&page=${pageNumber}&per_page=80`
    );
    if (!res.ok) throw new Error("Failed to fetch images");
    return res.json();
  };

  const loadMoreImages = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const data = await fetchImages(page);

      if (data.photos.length === 0) {
        setHasMore(false);
        return;
      }

      setImages((prevImages) => [...prevImages, ...data.photos]);
      setPage((prevPage) => prevPage + 1);

      // Check if we've reached the total number of results
      if (data.total_results <= page * 80) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more images:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, query]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreImages();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreImages, hasMore]);

  // Initial load
  useEffect(() => {
    loadMoreImages();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((photo) => (
          <ImageCard key={photo.id} photo={photo} />
        ))}
      </div>

      {/* Loading indicator and sentinel */}
      <div
        ref={loadingRef}
        className="w-full h-20 flex items-center justify-center"
      >
        {loading && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        )}
        {!hasMore && images.length > 0 && (
          <p className="text-gray-500 text-center py-4">
            No more images to load
          </p>
        )}
      </div>
    </div>
  );
}
