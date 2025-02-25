"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ImageCard from "./ImageCard";
import Categories from "./Categories";
import { useSearchContext } from "./SearchContext";

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
  const [category, setCategory] = useState("nature");
  const { searchTerm } = useSearchContext();

  const fetchImages = async (pageNumber: number): Promise<PexelsResponse> => {
    const query = searchTerm || category;
    const res = await fetch(
      `/api/pexels?query=${encodeURIComponent(
        query
      )}&page=${pageNumber}&per_page=80`
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

      if (data.total_results <= page * 80) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more images:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, category, searchTerm]);

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setImages([]); // Clear current images
    setPage(1); // Reset page
    setHasMore(true); // Reset hasMore
    setCategory(newCategory);
  };

  // Reset images when search term changes
  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm]);

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

  // Initial load and category/search change load
  useEffect(() => {
    loadMoreImages();
  }, [category, searchTerm]);

  return (
    <div className="flex flex-col w-full">
      {!searchTerm && (
        <Categories
          onCategorySelect={handleCategoryChange}
          currentCategory={category}
        />
      )}

      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </div>

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
    </div>
  );
}
