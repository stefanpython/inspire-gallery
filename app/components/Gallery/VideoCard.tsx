"use client";

import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";

interface VideoFile {
  link: string;
  quality: string;
  width: number;
  height: number;
}

interface VideoCardProps {
  video: {
    id: number;
    video_files: VideoFile[];
    image: string;
    duration: number;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get the HD quality video file or the first available one
  const videoFile =
    video.video_files.find((file) => file.quality === "hd") ||
    video.video_files[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleDownload = async () => {
    try {
      const response = await fetch(videoFile.link);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pexels-video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <div
        className="relative w-full h-64 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        <video
          src={videoFile.link}
          poster={video.image}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity">
          <svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div
            ref={modalRef}
            className="relative w-full max-w-5xl h-full max-h-[90vh] m-4 bg-white rounded-lg overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                if (videoRef.current) {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              }}
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

            {/* Video container */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={videoFile.link}
                  className="w-full h-full"
                  controls
                  onClick={togglePlay}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
