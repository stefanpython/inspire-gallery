"use client";

import { useState } from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  weight: ["700"],
  subsets: ["latin"],
});

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className={`${orbitron.className} text-2xl font-bold`}>
          <span className="text-indigo-600">Inspire</span>{" "}
          <span className="text-purple-500 italic">Gallery</span>
        </h1>
        <div className="relative w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search images..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
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
        </div>
      </div>
    </nav>
  );
};

export default SearchBar;
