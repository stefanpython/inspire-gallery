"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ImageCard from "./ImageCard";
import VideoCard from "./VideoCard";
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

interface PexelsVideo {
  id: number;
  video_files: Array<{
    link: string;
    quality: string;
    width: number;
    height: number;
  }>;
  image: string;
  duration: number;
}

interface PexelsResponse {
  photos?: PexelsPhoto[];
  videos?: PexelsVideo[];
  total_results: number;
  page: number;
}

export default function Gallery() {
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState("nature");
  const { searchTerm, mediaType } = useSearchContext();

  const fetchMedia = async (pageNumber: number): Promise<PexelsResponse> => {
    const query = searchTerm || category;
    const endpoint = mediaType === "images" ? "pexels" : "pexels/videos";
    const res = await fetch(
      `/api/${endpoint}?query=${encodeURIComponent(
        query
      )}&page=${pageNumber}&per_page=80`
    );
    if (!res.ok) throw new Error("Failed to fetch media");
    return res.json();
  };

  const loadMoreMedia = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const data = await fetchMedia(page);

      if (
        (data.photos?.length === 0 && mediaType === "images") ||
        (data.videos?.length === 0 && mediaType === "videos")
      ) {
        setHasMore(false);
        return;
      }

      if (mediaType === "images" && data.photos) {
        setImages((prevImages) => [...prevImages, ...data.photos!]);
      } else if (mediaType === "videos" && data.videos) {
        setVideos((prevVideos) => [...prevVideos, ...data.videos!]);
      }

      setPage((prevPage) => prevPage + 1);

      if (data.total_results <= page * 80) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more media:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, category, searchTerm, mediaType]);

  const handleCategoryChange = (newCategory: string) => {
    setImages([]);
    setVideos([]);
    setPage(1);
    setHasMore(true);
    setCategory(newCategory);
  };

  useEffect(() => {
    setImages([]);
    setVideos([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, mediaType]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreMedia();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreMedia, hasMore]);

  useEffect(() => {
    loadMoreMedia();
  }, [category, searchTerm, mediaType]);

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
          {mediaType === "images" &&
            images.map((photo) => <ImageCard key={photo.id} photo={photo} />)}
          {mediaType === "videos" &&
            videos.map((video) => <VideoCard key={video.id} video={video} />)}
        </div>

        <div
          ref={loadingRef}
          className="w-full h-20 flex items-center justify-center"
        >
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          )}
          {!hasMore && (images.length > 0 || videos.length > 0) && (
            <p className="text-gray-500 text-center py-4">
              No more {mediaType} to load
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
