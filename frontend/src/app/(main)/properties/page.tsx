"use client";

import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { useSearchProperties } from "@/hooks/useProperty";
import type { FilterInput, PropertyType } from "@/types";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const searchParams = useSearchParams()

  const city = searchParams.get("city")
  const type = searchParams.get("type")
  const propertyTypes: PropertyType[] = [
    "apartment",
    "villa",
    "house",
    "plot",
    "commercial"
  ];

  const [filters, setFilters] = useState<FilterInput>({
    city: city ? [city.toLowerCase()] : undefined,

    type:
      type && propertyTypes.includes(type as PropertyType)
        ? [type as PropertyType]
        : undefined,

    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const { data, isLoading } = useSearchProperties(filters);

  const {
    data: properties = [],
    page = 1,
    total = 0,
    totalPages = 0
  } = data ?? {};

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="property-search flex gap-5 p-5">
      <PropertyFilters
        filters={filters}
        setFilters={setFilters}
      />

      <PropertyGrid
        properties={properties}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Page;