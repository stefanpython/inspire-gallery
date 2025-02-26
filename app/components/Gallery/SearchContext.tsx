"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  mediaType: "images" | "videos";
  setMediaType: (type: "images" | "videos") => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState<"images" | "videos">("images");

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchTerm,
        setSearchTerm,
        mediaType,
        setMediaType,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}
