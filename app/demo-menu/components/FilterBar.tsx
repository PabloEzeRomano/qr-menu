'use client';

interface Filter {
  key: string;
  label: string;
}

interface FilterBarProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="max-w-5xl mx-auto mb-10 flex flex-wrap items-center justify-center gap-3">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 shadow-lg border backdrop-blur-md ${
            filter.key === activeFilter
              ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white border-cyan-400 shadow-cyan-500/25 scale-105'
              : 'bg-white/20 border-white/30 text-white hover:bg-white/40 hover:scale-105 hover:shadow-white/20 cursor-pointer'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
