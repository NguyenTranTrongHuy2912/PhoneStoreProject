import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * ✅ useFetch Hook
 * Generic hook for React Query data fetching
 * @param key - Query key
 * @param queryFn - Async function to fetch data
 * @param options - React Query options
 */
export const useFetch = <T,>(
  key: string[],
  queryFn: () => Promise<T>,
  options: any = {}
) => {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn,
    ...options,
  });
};

/**
 * ✅ useMutate Hook
 * Generic hook for mutations (POST, PUT, DELETE)
 * @param mutationFn - Async function to execute
 * @param invalidateKeys - Query keys to invalidate on success
 * @param onSuccess - Callback on success
 */
export const useMutate = <T, V>(
  mutationFn: (data: V) => Promise<T>,
  invalidateKeys: string[][] = [],
  onSuccess?: (data: T) => void,
  onError?: (error: AxiosError) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, V>({
    mutationFn,
    onSuccess: (data) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      onSuccess?.(data);
    },
    onError,
  });
};

/**
 * ✅ useDebounce Hook
 * Debounce value for search/filter
 */
export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * ✅ useLocalStorage Hook
 * Persist state to localStorage
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};

/**
 * ✅ usePagination Hook
 * Manage pagination state
 */
export const usePagination = (initialPage: number = 1, pageSize: number = 10) => {
  const [page, setPage] = React.useState(initialPage);

  const goToPage = (newPage: number) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => {
    if (page > 1) goToPage(page - 1);
  };

  return {
    page,
    pageSize,
    setPage,
    goToPage,
    nextPage,
    prevPage,
    offset: (page - 1) * pageSize,
  };
};
