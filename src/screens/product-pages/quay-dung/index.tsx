"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePageSettings, useProductFilters } from "@/hooks/usePageSettings";
import { getProducts } from "@/lib/api";
import { Product } from "@/hooks/useProducts";
import PageHero from "../components/PageHero";
import FeaturedProductsCarousel from "../components/FeaturedProductsCarousel";
import FilterBar, { FilterGroup } from "../components/FilterBar";
import ProductsPhotoGallery from "../components/ProductsPhotoGallery";
import LoadingScreen from "@/components/LoadingScreen";

export default function QuayDungPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );

  // Get page settings
  const { data: pageSettings, isLoading: isLoadingSettings } =
    usePageSettings("QUAY_DUNG");

  // Get filters
  const { data: filters, isLoading: isLoadingFilters } =
    useProductFilters("QUAY_DUNG");

  // Get products with filters
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", "QUAY_DUNG", activeFilters],
    queryFn: () => {
      const params: Parameters<typeof getProducts>[0] = {
        productType: "QUAY_DUNG",
        limit: 100,
      };

      // Add active filters to params
      if (activeFilters.year?.length) {
        params.year = activeFilters.year;
      }
      if (activeFilters.location?.length) {
        params.location = activeFilters.location;
      }
      if (activeFilters.category?.length) {
        params.categoryText = activeFilters.category;
      }
      if (activeFilters.equipment?.length) {
        params.equipmentIds = activeFilters.equipment;
      }

      return getProducts(params);
    },
  });

  const products = productsData?.data || [];

  // Build filter groups
  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [];

    // Year filter (common for all product types)
    if (filters?.years && filters.years.length > 0) {
      groups.push({
        label: "Năm",
        key: "year",
        options: filters.years.map((year) => ({
          label: year,
          value: year,
        })),
      });
    }

    if (filters?.locations && filters.locations.length > 0) {
      groups.push({
        label: "Địa điểm",
        key: "location",
        options: filters.locations.map((location) => ({
          label: location,
          value: location,
        })),
      });
    }

    if (filters?.categories && filters.categories.length > 0) {
      groups.push({
        label: "Thể loại",
        key: "category",
        options: filters.categories.map((category) => ({
          label: category,
          value: category,
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

    return groups;
  }, [filters]);

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[filterKey] || [];
      const isActive = current.includes(value);

      return {
        ...prev,
        [filterKey]: isActive
          ? current.filter((v) => v !== value)
          : [...current, value],
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

  if (isLoadingSettings || isLoadingFilters) {
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

      {pageSettings.featuredProductIds &&
        pageSettings.featuredProductIds.length > 0 && (
          <FeaturedProductsCarousel
            products={
              (pageSettings.featuredProductIds as unknown as Product[]) || []
            }
          />
        )}

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
    </div>
  );
}
