"use client";

import { useState } from "react";
import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import Container from "@/components/Container";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  label: string;
  key: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filterGroups: FilterGroup[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (filterKey: string, value: string) => void;
  onClearFilters: () => void;
  onClearGroupFilters?: (filterKey: string) => void;
}

export default function FilterBar({
  filterGroups,
  activeFilters,
  onFilterChange,
  onClearFilters,
  onClearGroupFilters,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const toggleFilters = () => {
    setIsExpanded((prev) => !prev);
  };

  const hasActiveFilters = Object.values(activeFilters).some(
    (filters) => filters.length > 0
  );

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce(
      (sum, filters) => sum + filters.length,
      0
    );
  };

  return (
    <section className="py-8 bg-midnight/50 backdrop-blur-sm border-y border-spirit-cyan/10">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 text-pure-white hover:text-spirit-cyan transition-colors"
          >
            <FilterOutlined className="text-xl" />
            <h3 className="text-2xl font-bold">Bộ lọc</h3>
            <span
              className={`text-muted-blue transition-transform duration-300 ease-in-out ml-2 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-moonlight-light hover:bg-spirit-cyan/20 text-ice-white transition-all border border-spirit-cyan/20"
            >
              <CloseOutlined className="text-sm" />
              <span>Xóa bộ lọc ({getActiveFilterCount()})</span>
            </button>
          )}
        </div>

        {/* Filter Groups */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-6 pt-2">
            {filterGroups.map((group) => {
              const hasOptions = group.options && group.options.length > 0;

              if (!hasOptions) return null;

              return (
                <div key={group.key} className="space-y-3">
                  <span className="text-lg font-semibold text-ice-white block">
                    {group.label}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {/* Nút "Tất cả" */}
                    {onClearGroupFilters && (
                      <button
                        onClick={() => onClearGroupFilters(group.key)}
                        className={`px-4 py-2 rounded-lg transition-all border ${
                          !activeFilters[group.key] ||
                          activeFilters[group.key].length === 0
                            ? "bg-spirit-cyan text-midnight border-spirit-cyan font-medium"
                            : "bg-moonlight-light text-ice-white border-spirit-cyan/20 hover:border-spirit-cyan hover:bg-spirit-cyan/10"
                        }`}
                      >
                        Tất cả
                      </button>
                    )}
                    {group.options.map((option) => {
                      const isActive =
                        activeFilters[group.key]?.includes(option.value) ??
                        false;

                      return (
                        <button
                          key={option.value}
                          onClick={() =>
                            onFilterChange(group.key, option.value)
                          }
                          className={`px-4 py-2 rounded-lg transition-all border ${
                            isActive
                              ? "bg-spirit-cyan text-midnight border-spirit-cyan font-medium"
                              : "bg-moonlight-light text-ice-white border-spirit-cyan/20 hover:border-spirit-cyan hover:bg-spirit-cyan/10"
                          }`}
                        >
                          {option.label}
                          {option.count !== undefined && (
                            <span className="ml-2 opacity-70">
                              ({option.count})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
