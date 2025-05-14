import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { debounce } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onFilter?: (field: string, value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    name: string;
    label: string;
    options: FilterOption[];
    selectedValue?: string;
  }[];
  defaultSearchValue?: string;
  className?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onFilter,
  searchPlaceholder = "Search...",
  filters = [],
  defaultSearchValue = "",
  className = "",
  showClearButton = true,
  onClear,
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultSearchValue);

  // Debounced search function to prevent excessive updates
  const debouncedSearch = React.useCallback(
    debounce((value: string) => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300),
    [onSearch]
  );

  // Sync search query with default value (from URL)
  useEffect(() => {
    setSearchQuery(defaultSearchValue);
  }, [defaultSearchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (name: string, value: string) => {
    if (onFilter) {
      onFilter(name, value);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="pl-8 pr-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && showClearButton && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {filters.map((filter) => (
        <Select
          key={filter.name}
          value={filter.selectedValue || ""}
          onValueChange={(value) => handleFilterChange(filter.name, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filter.label}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value || "all"}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
};

export default FilterBar;
