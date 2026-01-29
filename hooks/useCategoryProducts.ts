"use client";

import { useEffect, useState, useCallback } from "react";
import { Product } from "@/types";
import { getProductsByCategory } from "@/lib/firebase/products";
import { FilterState, defaultFilterState } from "@/lib/config/filters";
import type { SortOption } from "@/lib/config/filters";
import { PLP_DEFAULT_PAGE_SIZE } from "@/lib/config/plp";

export interface UseCategoryProductsOptions {
  useApi?: boolean;
  pageSize?: number;
}

export function useCategoryProducts(slug: string, options: UseCategoryProductsOptions = {}) {
  const { useApi = false, pageSize = PLP_DEFAULT_PAGE_SIZE } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchFromApi = useCallback(
    async (pageNum: number, sortVal: SortOption) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          pageSize: String(pageSize),
          sort: sortVal,
        });
        const res = await fetch(`/api/category/${encodeURIComponent(slug)}/products?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
        setHasMore(data.hasMore ?? false);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setProducts([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [slug, pageSize]
  );

  useEffect(() => {
    if (useApi) {
      fetchFromApi(page, filters.sort);
    } else {
      let cancelled = false;
      setLoading(true);
      getProductsByCategory(slug)
        .then((data) => {
          if (!cancelled) setProducts(data);
        })
        .catch((error) => {
          if (!cancelled) {
            console.error("Error fetching category products:", error);
            setProducts([]);
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }
  }, [slug, useApi, page, filters.sort, fetchFromApi]);

  const filteredProducts = useApi
    ? products
    : products.filter((p) => {
        if (filters.sizes.length) {
          const hasSize = p.sizes?.some((s) => filters.sizes.includes(s));
          if (!hasSize) return false;
        }
        if (filters.colors.length && !p.colors?.some((c) => filters.colors.includes(c)))
          return false;
        if (filters.minPrice != null && p.price < filters.minPrice) return false;
        if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
        if (filters.inStockOnly && !p.inStock) return false;
        return true;
      });

  const sortedProducts =
    useApi
      ? filteredProducts
      : [...filteredProducts].sort((a, b) => {
          switch (filters.sort) {
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            case "rating":
              return (b.rating ?? 0) - (a.rating ?? 0);
            case "newest":
            default:
              return (
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
          }
        });

  return {
    products: sortedProducts,
    loading,
    filters,
    setFilters,
    ...(useApi ? { page, setPage, total, hasMore } : {}),
  };
}
