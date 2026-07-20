"use client"
import PropertyForm from '@/components/properties/PropertyForm'
import PropertyImageUploader from '@/components/properties/PropertyImageUploader'
import { useProperty } from '@/hooks/useProperty'
import { PropertyImage } from '@/types'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiHome, BiLoaderCircle } from 'react-icons/bi'

const page = () => {
    const { id } = useParams<{ id: string }>();
    const propertyId = Number(id)
    const { data: property, isLoading } = useProperty(propertyId)

    const [images, setImages] = useState<PropertyImage[]>([])

    useEffect(() => {
        setImages(property?.propertyImages ?? [])
    }, [property])

    // Loading State
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="flex flex-col items-center gap-4">
                    <BiLoaderCircle className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-text/60 text-sm">Loading property details...</p>
                </div>
            </div>
        )
    }

    // Not Found State
    if (!property) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="flex flex-col items-center text-center max-w-md">
                    <div className="w-24 h-24 bg-primary-subtle rounded-full flex items-center justify-center mb-4">
                        <BiHome className="w-12 h-12 text-primary/40" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Property Not Found</h3>
                    <p className="text-text/60 mb-6">
                        The property you're looking for doesn't exist or has been removed.
                    </p>
                    <a
                        href="/properties"
                        className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200"
                    >
                        Browse Properties
                    </a>
                </div>
            </div>
        )
    }



    return (
        <div className='property-update flex flex-col items-center gap-5 mt-8'>
            <div className="hero text-center">
                <h1>
                    Update a Property
                </h1>
                <p>
                    Update the details for {property.title}
                </p>
            </div>

            <PropertyImageUploader images={images} setImages={setImages} editMode={true} propertyId={property.id} />
            <PropertyForm initialState={property} images={images} setImages={setImages} />
        </div>
    )
}

export default page