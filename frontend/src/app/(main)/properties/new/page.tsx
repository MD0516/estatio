"use client"
import PropertyForm from '@/components/properties/PropertyForm'
import PropertyImageUploader from '@/components/properties/PropertyImageUploader'
import { PropertyImage } from '@/types/property'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [images, setImages] = useState<PropertyImage[]>([])
    
    return (
        <div className='property-new flex flex-col items-center gap-5 mt-8'>
            <div className="hero text-center">
                <h1>
                    Post a Property
                </h1>
                <p>
                    Fill in the details below to list your property on Estatio
                </p>
            </div>

            <PropertyImageUploader images={images} setImages={setImages} />
            <PropertyForm images={images} setImages={setImages} />
        </div>
    )
}

export default page