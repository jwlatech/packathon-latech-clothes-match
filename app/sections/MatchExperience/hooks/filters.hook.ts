import { useCallback, useRef } from "react";

export const useQueryFilters = <T>(
  initialValue: T,
  action: (filters: T) => void
) => {
  const filtersRef = useRef<T | null>(initialValue);
  const handleFilters = useCallback(
    (f: T) => {
      if (!f) return;
      action(f);
    },
    [action]
  );
  return {
    setFilters: (newFilters: T) => {
      filtersRef.current = newFilters;
      handleFilters(newFilters);
    },
    setMultipleFilters: (partialFilters: Partial<T>) => {
      const newFilters = { ...filtersRef.current, ...partialFilters } as T;
      filtersRef.current = newFilters;
      handleFilters(newFilters);
    },
    setFilter: (field: keyof T, value: any) => {
      const newFilters = { ...filtersRef.current } as T;
      newFilters[field] = value;
      filtersRef.current = newFilters;
      handleFilters(newFilters);
    },
  };
};
