"use client";

import { Orbitron } from "next/font/google";
import Image from "next/image";
import { useSearchContext } from "./SearchContext";

const orbitron = Orbitron({
  weight: ["700"],
  subsets: ["latin"],
});

const SearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    setSearchTerm,
    mediaType,
    setMediaType,
  } = useSearchContext();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSearchTerm("");
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={handleReset}
          className="flex items-center focus:outline-none"
        >
          <h1 className={`${orbitron.className} text-3xl font-bold`}>
            <Image
              src="/logo.png"
              alt="Gallery Logo"
              width={100}
              height={100}
              className="inline-block mr-2 rounded-[55px]"
              priority
            />
            <span className="text-[#9b2452]">Inspire</span>{" "}
            <span className="text-[#FFA500] italic">Gallery</span>
          </h1>
        </button>
        <form
          onSubmit={handleSubmit}
          className="relative w-full sm:w-96 flex flex-col sm:flex-row gap-2"
        >
          <select
            value={mediaType}
            onChange={(e) =>
              setMediaType(e.target.value as "images" | "videos")
            }
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:block mb-2 sm:mb-0"
          >
            <option value="images">Images</option>
            <option value="videos">Videos</option>
          </select>
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default SearchBar;
