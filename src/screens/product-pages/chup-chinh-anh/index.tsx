"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePageSettings, useProductFilters } from "@/hooks/usePageSettings";
import { getProducts } from "@/lib/api";
import { Product } from "@/hooks/useProducts";
import { useAlbums, Album } from "@/hooks/useAlbums";
import PageHero from "../components/PageHero";
import FeaturedProductsCarousel from "../components/FeaturedProductsCarousel";
import FilterBar, { FilterGroup } from "../components/FilterBar";
import ProductsPhotoGallery from "../components/ProductsPhotoGallery";
import LoadingScreen from "@/components/LoadingScreen";

export default function ChupChinhAnhPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );

  // Get page settings
  const { data: pageSettings, isLoading: isLoadingSettings } =
    usePageSettings("CHUP_CHINH_ANH");

  // Get filters
  const { data: filters, isLoading: isLoadingFilters } =
    useProductFilters("CHUP_CHINH_ANH");

  // Get albums
  const { data: albums = [], isLoading: isLoadingAlbums } = useAlbums();

  // Get products with filters
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", "CHUP_CHINH_ANH", activeFilters],
    queryFn: () => {
      const params: Parameters<typeof getProducts>[0] = {
        productType: "CHUP_CHINH_ANH",
        limit: 100,
      };

      // Add active filters to params
      if (activeFilters.year?.length) {
        params.year = activeFilters.year;
      }
      if (activeFilters.photographyType?.length) {
        params.photographyType = activeFilters.photographyType;
      }
      if (activeFilters.equipment?.length) {
        params.equipmentIds = activeFilters.equipment;
      }
      if (activeFilters.album?.length) {
        params.albumId = activeFilters.album[0];
      }

      return getProducts(params);
    },
  });

  const products = productsData?.data || [];

  // Build filter groups
  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [];

    // Year filter (common for all product types)
    // Generate years from current year to 5 years ago
    const currentYear = new Date().getFullYear();
    const generatedYears: string[] = [];
    for (let i = 0; i <= 10; i++) {
      generatedYears.push(String(currentYear - i));
    }

    // Merge with years from API and remove duplicates
    const allYears = [
      ...new Set([...generatedYears, ...(filters?.years || [])]),
    ].sort((a, b) => Number(b) - Number(a)); // Sort descending

    if (allYears.length > 0) {
      groups.push({
        label: "Năm",
        key: "year",
        options: allYears.map((year) => ({
          label: year,
          value: year,
        })),
      });
    }

    if (filters?.photographyTypes && filters.photographyTypes.length > 0) {
      groups.push({
        label: "Thể loại chụp ảnh",
        key: "photographyType",
        options: filters.photographyTypes.map((type) => ({
          label: type,
          value: type,
        })),
      });
    }

    if (filters?.equipment && filters.equipment.length > 0) {
      groups.push({
        label: "Thiết bị",
        key: "equipment",
        options: filters.equipment.map((equipment) => ({
          label: equipment.name,
          value: equipment._id,
        })),
      });
    }

    // Album filter
    if (albums && albums.length > 0) {
      groups.push({
        label: "Dự án",
        key: "album",
        options: albums.map((album: Album) => ({
          label: album.name,
          value: album._id,
        })),
      });
    }

    return groups;
  }, [filters, albums]);

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[filterKey] || [];
      const isActive = current.includes(value);

      return {
        ...prev,
        // Single select: if clicking the same option, clear it; otherwise replace with new selection
        [filterKey]: isActive ? [] : [value],
      };
    });
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const handleClearGroupFilters = (filterKey: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  if (isLoadingSettings || isLoadingFilters || isLoadingAlbums) {
    return <LoadingScreen message="Đang tải..." />;
  }

  if (!pageSettings) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <p className="text-muted-blue">Không tìm thấy cài đặt trang</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      <PageHero
        title={pageSettings.title}
        description={pageSettings.description}
        backgroundImage={pageSettings.backgroundImage}
      />

      {filterGroups.length > 0 && (
        <FilterBar
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onClearGroupFilters={handleClearGroupFilters}
        />
      )}

      {isLoadingProducts ? (
        <div className="py-20 text-center">
          <p className="text-muted-blue">Đang tải sản phẩm...</p>
        </div>
      ) : (
        <ProductsPhotoGallery products={products} />
      )}

      {pageSettings.featuredProductIds &&
        pageSettings.featuredProductIds.length > 0 && (
          <FeaturedProductsCarousel
            products={
              (pageSettings.featuredProductIds as unknown as Product[]) || []
            }
          />
        )}
    </div>
  );
}
