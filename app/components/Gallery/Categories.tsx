"use client";

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
  currentCategory: string;
}

export default function Categories({
  onCategorySelect,
  currentCategory,
}: CategoriesProps) {
  const categories = [
    "Nature",
    "Animals",
    "City",
    "Food",
    "Architecture",
    "Travel",
    "Technology",
    "People",
    "Business",
    "Space",
    "Sports",
    "Cars",
    "Fashion",
    "Art",
    "Abstract",
  ];

  return (
    <div className="w-full overflow-x-auto py-4 px-4 bg-white shadow-sm">
      <div className="flex space-x-4 min-w-max max-w-7xl mx-auto justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category.toLowerCase())}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
              ${
                currentCategory === category.toLowerCase()
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
