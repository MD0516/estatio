"use client"
import { useCreateProperty, useUpdateProperty, useUpdatePropertyImages } from '@/hooks/useProperty';
import { CreatePropertyInput } from '@/types';
import { Property, PropertyFormState, PropertyImage } from '@/types/property';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { BiLoaderCircle } from 'react-icons/bi'

type PropertyFormTypes = {
    initialState?: Property,
    images: PropertyImage[]
    setImages: Dispatch<SetStateAction<PropertyImage[]>>,
}

type FormField =
    | {
        label: string;
        name: string;
        inputType: "input";
        type: string;
        placeholder: string;
        required: boolean
    }
    | {
        label: string;
        name: string;
        inputType: "textarea";
        placeholder: string;
        required: boolean
    }
    | {
        label: string;
        name: string;
        inputType: "select";
        options: string[];
        placeholder: string;
        required: boolean
    };

const PropertyForm = ({
    initialState,
    images,
    setImages,
}: Readonly<PropertyFormTypes>) => {
    const { mutate: createProperty, isPending: isCreating } = useCreateProperty()
    const { mutate: updateProperty, isPending: isUpdating } = useUpdateProperty()
    const { mutate: updatePropertyImages } = useUpdatePropertyImages()
    const isEditMode = !!initialState;

    const initialForm: PropertyFormState = {
        title: "",
        description: "",
        type: "",
        listingType: "",
        price: "",
        bedroom: "",
        status: "active",
        areaSqft: "",
        floor: "",
        bathroom: "",
        balcony: "",
        furnishingStatus: "none",
        parking: "none",
        facing: "",
        address: "",
        locality: "",
        city: "",
        state: "",
        gMapUrl: ""
    };

    const [form, setForm] = useState<PropertyFormState>(initialForm);
    const [isLoading, setIsLoading] = useState(false);

    // Populate form when initialState changes (for edit mode)
    useEffect(() => {
        if (initialState) {
            setIsLoading(true);
            setForm({
                title: initialState?.title || "",
                description: initialState?.description || "",
                type: initialState?.type || "",
                listingType: initialState?.listingType || "",
                price: initialState?.price?.toString() || "",
                bedroom: initialState?.bedroom?.toString() || "",
                status: initialState?.status || "active",
                areaSqft: initialState?.propertyDetails?.areaSqft?.toString() || "",
                floor: initialState?.propertyDetails?.floor?.toString() || "",
                bathroom: initialState?.propertyDetails?.bathroom?.toString() || "",
                balcony: initialState?.propertyDetails?.balcony?.toString() || "",
                furnishingStatus: initialState?.propertyDetails?.furnishingStatus || "none",
                parking: initialState?.propertyDetails?.parking || "none",
                facing: initialState?.propertyDetails?.facing || "",
                address: initialState?.address || "",
                locality: initialState?.locality || "",
                city: initialState?.city || "",
                state: initialState?.state || "",
                gMapUrl: initialState?.gMapUrl || ""
            });
            setIsLoading(false);
        }
    }, [initialState]);

    const fields: FormField[] = [
        {
            label: "Title",
            name: "title",
            inputType: "input",
            type: "text",
            placeholder: "Enter property title",
            required: true
        },
        {
            label: "Description",
            name: "description",
            inputType: "textarea",
            placeholder: "Describe the property",
            required: true
        },
        {
            label: "Property Type",
            name: "type",
            inputType: "select",
            options: ["apartment", "villa", "house", "plot", "commercial"],
            placeholder: "Select property type",
            required: true
        },
        {
            label: "Listing Type",
            name: "listingType",
            inputType: "select",
            options: ["rent", "lease", "sale"],
            placeholder: "Select listing type",
            required: true
        },
        {
            label: "Price",
            name: "price",
            inputType: "input",
            type: "number",
            placeholder: "Enter property price",
            required: true
        },
        {
            label: "Bedrooms",
            name: "bedroom",
            inputType: "input",
            type: "number",
            placeholder: "Enter number of bedrooms",
            required: true
        },
        ...(isEditMode
            ? [{
                label: "Property Status",
                name: "status",
                inputType: "select",
                options: ["active", "sold", "rented", "inactive"],
                placeholder: "Select property status",
                required: true
            } as FormField]
            : []),
        {
            label: "Area (sq. ft.)",
            name: "areaSqft",
            inputType: "input",
            type: "number",
            placeholder: "Enter property area in sq. ft.",
            required: true
        },
        {
            label: "Floor",
            name: "floor",
            inputType: "input",
            type: "number",
            placeholder: "Enter floor number",
            required: false
        },
        {
            label: "Bathrooms",
            name: "bathroom",
            inputType: "input",
            type: "number",
            placeholder: "Enter number of bathrooms",
            required: true
        },
        {
            label: "Balconies",
            name: "balcony",
            inputType: "input",
            type: "number",
            placeholder: "Enter number of balconies",
            required: true
        },
        {
            label: "Furnishing Status",
            name: "furnishingStatus",
            inputType: "select",
            options: ["full", "semi", "none"],
            placeholder: "Select furnishing status",
            required: true
        },
        {
            label: "Parking",
            name: "parking",
            inputType: "select",
            options: ["car", "bike", "both", "none"],
            placeholder: "Select parking availability",
            required: true
        },
        {
            label: "Facing",
            name: "facing",
            inputType: "input",
            type: "text",
            placeholder: "Enter property facing direction",
            required: true
        },
        {
            label: "Address",
            name: "address",
            inputType: "textarea",
            placeholder: "Enter complete property address",
            required: true
        },
        {
            label: "Locality",
            name: "locality",
            inputType: "input",
            type: "text",
            placeholder: "Enter locality",
            required: true
        },
        {
            label: "City",
            name: "city",
            inputType: "input",
            type: "text",
            placeholder: "Enter city",
            required: true
        },
        {
            label: "State",
            name: "state",
            inputType: "input",
            type: "text",
            placeholder: "Enter state",
            required: true
        },
        {
            label: "Location",
            name: "gMapUrl",
            inputType: "input",
            type: "text",
            placeholder: "Paste Google Maps location URL",
            required: true
        }
    ];

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

    const resetForm = () => {
        setForm(initialForm);
        setImages([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.type || !form.listingType) {
            return;
        }

        const payload: CreatePropertyInput = {
            ...form,
            type: form.type,
            listingType: form.listingType,
            price: Number(form.price),
            bedroom: Number(form.bedroom),
            areaSqft: Number(form.areaSqft),
            floor: form.floor ? Number(form.floor) : undefined,
            bathroom: Number(form.bathroom),
            balcony: Number(form.balcony),
            images
        };

        if (isEditMode && initialState?.id) {
            updateProperty(
                { id: initialState.id, data: payload },
                {
                    onSuccess: () => {
                        resetForm()
                    }
                }
            )
            updatePropertyImages({
                propertyId: initialState.id,
                data: {
                    images  
                }
            })
        } else {
            createProperty(payload, {
                onSuccess: () => {
                    resetForm()
                }
            })
        }
    }

    const isSubmitting = isCreating || isUpdating;

    // Loading state for edit mode
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <BiLoaderCircle className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-text/60 text-sm">Loading property data...</p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="property-form mx-auto flex flex-col">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field, index) => (
                    <div
                        className={`form-control flex flex-col gap-2 ${index === 0 || field.inputType === "textarea" ? "md:col-span-2" : ""
                            }`}
                        key={field.name}
                    >
                        <label htmlFor={field.name} className="text-sm font-medium text-text-muted tracking-wide">
                            {field.label}
                            {field.required && <span className="text-accent ml-1">*</span>}
                        </label>

                        {field.inputType === "input" && (
                            <div className="relative group">
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={(form as any)[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full rounded-lg px-4 py-3 bg-surface border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted/60 disabled:opacity-60 disabled:cursor-not-allowed"
                                    required={field.required}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}

                        {field.inputType === "textarea" && (
                            <div className="relative group">
                                <textarea
                                    name={field.name}
                                    value={(form as any)[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full rounded-lg px-4 py-3 bg-surface border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-text-muted/60 resize-y min-h-[120px] disabled:opacity-60 disabled:cursor-not-allowed"
                                    rows={4}
                                    required={field.required}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}

                        {field.inputType === "select" && (
                            <div className="relative group">
                                <select
                                    name={field.name}
                                    className="w-full rounded-lg px-4 py-3 bg-surface border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                    value={(form as any)[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    disabled={isSubmitting}
                                >
                                    <option value="" disabled>{field.placeholder || "Select an option"}</option>
                                    {field.options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted/50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button
                type='submit'
                className='btn btn-accent submit-btn my-6 mx-auto w-full md:w-auto px-12 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3'
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <BiLoaderCircle className="w-5 h-5 animate-spin" />
                        {isEditMode ? 'Updating...' : 'Listing...'}
                    </>
                ) : (
                    <>
                        {isEditMode ? 'Update Property' : 'List Property'}
                    </>
                )}
            </button>
        </form>
    )
}

export default PropertyForm