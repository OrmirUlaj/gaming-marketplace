import { useState, useCallback, useMemo } from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  category?: string;
  description?: string;
  imageUrl?: string;
}

interface UseProductFilters {
  products: Product[];
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}

export const useProductFilters = ({
  products,
  category,
  minPrice,
  maxPrice,
  search,
}: UseProductFilters) => {
  const [currentCategory, setCurrentCategory] = useState(category || '');
  const [currentMinPrice, setCurrentMinPrice] = useState(minPrice || '');
  const [currentMaxPrice, setCurrentMaxPrice] = useState(maxPrice || '');
  const [currentSearch, setCurrentSearch] = useState(search || '');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (currentCategory && product.category !== currentCategory) {
        return false;
      }

      // Price filter
      const price = product.price;
      if (currentMinPrice && price < parseFloat(currentMinPrice)) {
        return false;
      }
      if (currentMaxPrice && price > parseFloat(currentMaxPrice)) {
        return false;
      }

      // Search filter
      if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        return (
          product.title.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          false
        );
      }

      return true;
    });
  }, [products, currentCategory, currentMinPrice, currentMaxPrice, currentSearch]);

  const handleCategoryChange = useCallback((category: string) => {
    setCurrentCategory(category);
  }, []);

  const handleMinPriceChange = useCallback((price: string) => {
    setCurrentMinPrice(price);
  }, []);

  const handleMaxPriceChange = useCallback((price: string) => {
    setCurrentMaxPrice(price);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setCurrentSearch(search);
  }, []);

  return {
    filteredProducts,
    filters: {
      category: currentCategory,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
      search: currentSearch,
    },
    handlers: {
      handleCategoryChange,
      handleMinPriceChange,
      handleMaxPriceChange,
      handleSearchChange,
    },
  };
};
