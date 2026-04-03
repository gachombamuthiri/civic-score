'use client';

interface CategoryFiltersProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilters({ activeCategory = 'All Activities', onCategoryChange }: CategoryFiltersProps) {
  const categories = [
    { id: 'all', label: 'All Activities', emoji: '📋' },
    { id: 'volunteering', label: 'Volunteering', emoji: '🤝' },
    { id: 'health', label: 'Health', emoji: '🏥' },
    { id: 'environment', label: 'Environment', emoji: '🌿' },
    { id: 'community', label: 'Community', emoji: '👥' },
  ];

  return (
    <div className="mt-12 flex flex-wrap gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange?.(category.id)}
          className={`px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${
            activeCategory === category.label
              ? 'bg-gradient-to-r from-green-800 to-green-700 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>{category.emoji}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
}
