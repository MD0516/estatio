"use client"
import { useProperties } from '@/hooks/useProperty';
import { FilterInput, FurnishingStatus, Parking } from '@/types';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

type FormField =
    | {
        label: string;
        name: string;
        inputType: "input";
        type: "number" | "text";
        placeholder: string;
    }
    | {
        label: string;
        name: string;
        inputType: "multiChoice";
        options: string[];
    }
    | {
        label: string;
        name: string;
        inputType: "radio";
        options: string[];
    };


type PropertyFilterProps = {
    filters: FilterInput,
    setFilters: Dispatch<SetStateAction<FilterInput>>
}

const PropertyFilters = ({
    filters,
    setFilters
}: Readonly<PropertyFilterProps>) => {
    const { data: properties } = useProperties()
    const cityOptions = [
        ...new Set(properties?.map((property) => property.city.toLowerCase()) ?? [])
    ];
    const fields: FormField[] = [
        {
            label: "City",
            name: "city",
            inputType: "multiChoice",
            options: cityOptions
        },
        {
            label: "Property Type",
            name: "type",
            inputType: "multiChoice",
            options: [
                "apartment",
                "villa",
                "house",
                "plot",
                "commercial"
            ]
        },
        {
            label: "Listing Type",
            name: "listingType",
            inputType: "radio",
            options: [
                "rent",
                "lease",
                "sale"
            ]
        },
        {
            label: "Price (Min)",
            name: "minPrice",
            inputType: "input",
            type: "number",
            placeholder: "Enter minimum price"
        },
        {
            label: "Price (Max)",
            name: "maxPrice",
            inputType: "input",
            type: "number",
            placeholder: "Enter maximum price"
        },
        {
            label: "Bedrooms",
            name: "bedroom",
            inputType: "input",
            type: "number",
            placeholder: "Enter number of bedrooms"
        },
        {
            label: "Furnishing Status",
            name: "furnishingStatus",
            inputType: "multiChoice",
            options: [
                "full",
                "semi",
                "none"
            ]
        },
        {
            label: "Parking",
            name: "parking",
            inputType: "multiChoice",
            options: [
                "car",
                "bike",
                "both",
                "none"
            ]
        },
        {
            label: "Sort By",
            name: "sortBy",
            inputType: "radio",
            options: [
                "price",
                "createdAt"
            ]
        },
        {
            label: "Sort Order",
            name: "sortOrder",
            inputType: "radio",
            options: [
                "asc",
                "desc"
            ]
        }
    ];

    const [form, setForm] = useState({
        city: filters.city ?? [],
        type: filters.type ?? [],
        listingType: filters.listingType ?? "",

        minPrice: filters.minPrice?.toString() ?? "",
        maxPrice: filters.maxPrice?.toString() ?? "",
        bedroom: filters.bedroom?.toString() ?? "",

        furnishingStatus: filters.furnishingStatus ?? [],
        parking: filters.parking ?? [],

        sortBy: filters.sortBy ?? "createdAt",
        sortOrder: filters.sortOrder ?? "desc"
    });

    const searchedCities = (filters.city ?? []).filter(
        (city) => !cityOptions.includes(city.toLowerCase())
    );

    useEffect(() => {
        const formattedFilters: FilterInput = {
            city: form.city.length ? form.city : undefined,
            type: form.type.length ? form.type : undefined,
            listingType: form.listingType || undefined,

            minPrice: form.minPrice
                ? Number(form.minPrice)
                : undefined,

            maxPrice: form.maxPrice
                ? Number(form.maxPrice)
                : undefined,

            bedroom: form.bedroom
                ? Number(form.bedroom)
                : undefined,

            furnishingStatus: form.furnishingStatus.length
                ? form.furnishingStatus
                : undefined,

            parking: form.parking.length
                ? form.parking
                : undefined,

            sortBy: form.sortBy,
            sortOrder: form.sortOrder,

            page: 1
        };

        setFilters(formattedFilters);
    }, [form, setFilters]);

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        city: true,
        type: true,
        listingType: true,
        price: true,
        bedroom: true,
        furnishingStatus: true,
        parking: true,
        sort: true
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            const numValue = Number(value)
            if (numValue <= 0 && value !== "") {
                return
            }
        }

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMultiChoice = (name: string, value: string) => {
        setForm((prev) => {
            const currentValues = prev[name as keyof typeof prev] as string[]
            return {
                ...prev,
                [name]: currentValues.includes(value)
                    ? currentValues.filter((item) => item !== value)
                    : [...currentValues, value]
            };
        })
    }

    const handleSingleChoice = (name: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const handleReset = () => {
        setForm({
            city: [],
            type: [],
            listingType: "",
            minPrice: "",
            maxPrice: "",
            bedroom: "",
            furnishingStatus: [],
            parking: [],
            sortBy: "createdAt",
            sortOrder: "desc"
        })
    }

    const getActiveFilterCount = () => {
        let count = 0
        if (form.city.length > 0) count += form.city.length
        if (form.type.length > 0) count += form.type.length
        if (form.listingType) count++
        if (form.minPrice) count++
        if (form.maxPrice) count++
        if (form.bedroom) count++
        if (form.furnishingStatus.length > 0) count += form.furnishingStatus.length
        if (form.parking.length > 0) count += form.parking.length
        return count
    }

    return (
        <div className='property-filters bg-surface rounded-xl border border-border-light p-6 shadow-sm '>
            {/* Header */}
            <div className="header flex items-center justify-between mb-6 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-subtle rounded-lg">
                        <FiFilter size={20} className="text-accent" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text text-lg">Filters</h3>
                        {getActiveFilterCount() > 0 && (
                            <p className="text-xs text-text-muted">{getActiveFilterCount()} active filters</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleReset}
                    className="text-sm text-text-muted hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
                >
                    <FiX size={16} />
                    Reset
                </button>
            </div>

            {/* Form */}
            <form className="space-y-4">
                {fields.map((field, index) => {
                    const sectionKey = field.name === 'minPrice' || field.name === 'maxPrice'
                        ? 'price'
                        : field.name === 'sortBy' || field.name === 'sortOrder'
                            ? 'sort'
                            : field.name

                    const isExpanded = expandedSections[sectionKey] ?? true

                    return (
                        <div key={field.name} className='form-control border-b border-border-light/50 pb-4 last:border-0 last:pb-0'>
                            {/* Section Header */}
                            <button
                                type="button"
                                onClick={() => toggleSection(sectionKey)}
                                className="w-full flex items-center justify-between py-1 hover:text-accent transition-colors"
                            >
                                <label className="font-medium text-text text-sm cursor-pointer">
                                    {field.label}
                                </label>
                                {isExpanded ? (
                                    <FiChevronUp size={18} className="text-text-muted" />
                                ) : (
                                    <FiChevronDown size={18} className="text-text-muted" />
                                )}
                            </button>

                            {/* Section Content */}
                            {isExpanded && (
                                <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {field.inputType === "input" && (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={(form as any)[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-lg px-4 py-2.5 bg-surface border border-border-light focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 placeholder:text-text-muted/60 text-sm"
                                        />
                                    )}

                                    {field.inputType === "multiChoice" && (
                                        <div className='flex flex-wrap gap-2'>
                                            {field.name === "city" && searchedCities.map((city) => {
                                                const isSelected = (form.city as string[]).includes(city);
                                                return (
                                                    <button
                                                        key={`searched-${city}`}
                                                        type="button"
                                                        onClick={() => handleMultiChoice("city", city)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 cursor-pointer border-2 border-dashed ${isSelected
                                                            ? 'bg-accent text-white border-accent shadow-sm'
                                                            : 'bg-accent-subtle text-accent border-accent/40'
                                                            }`}
                                                    >
                                                        {city} <span className="text-xs opacity-70">(searched)</span>
                                                    </button>
                                                );
                                            })}
                                            {field.options.map((opt) => {
                                                const isSelected = (form[field.name as keyof typeof form] as string[]).includes(opt)
                                                return (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => handleMultiChoice(field.name, opt)}
                                                        className={`
                                                            px-3 py-1.5 rounded-lg text-sm transition-all duration-200 cursor-pointer
                                                            ${isSelected
                                                                ? 'bg-accent text-white shadow-sm'
                                                                : 'bg-surface-dark text-text-muted hover:bg-accent-subtle hover:text-accent'
                                                            }
                                                        `}
                                                    >
                                                        {opt}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {field.inputType === "radio" && (
                                        <div className='flex gap-2'>
                                            {field.options.map((opt) => {
                                                const isSelected = form[field.name as keyof typeof form] === opt
                                                return (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => handleSingleChoice(field.name, opt)}
                                                        className={`
                                                            px-3 py-1.5 rounded-lg text-sm transition-all duration-200 cursor-pointer
                                                            ${isSelected
                                                                ? 'bg-accent text-white shadow-sm'
                                                                : 'bg-surface-dark text-text-muted hover:bg-accent-subtle hover:text-accent'
                                                            }
                                                        `}
                                                    >
                                                        {opt}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </form>
        </div>
    )
}

export default PropertyFilters