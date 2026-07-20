"use client"

import { Property } from '@/types/property'
import React, { useState } from 'react'
import { BiBed, BiRuler, BiShower } from 'react-icons/bi'
import { BsStack } from 'react-icons/bs'
import { FaCar } from 'react-icons/fa'
import { GiSofa } from 'react-icons/gi'
import { MdLocationOn } from 'react-icons/md'
import Reviews from './Reviews'
import { useAppContext } from '@/context/AppContext'
import InquiryForm from './InquiryForm'
import { getAssetUrl } from '@/utils/getAssetUrl'

type DetailsProp = {
    property: Property
}

const Details = ({
    property
}: Readonly<DetailsProp>) => {
    const { isMobile } = useAppContext()
    const coverImg = property?.propertyImages?.find((i) => i.isCover === true)
    const [selectedImg, setSelectedImg] = useState<string>(coverImg?.url || property?.propertyImages?.[0]?.url || '')

    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(property.price)

    return (
        <div className="property-details px-4 py-8">
            {/* Image Section */}
            <div className="image-section mb-8">
                <div className="main-image relative rounded-xl overflow-hidden bg-surface aspect-[16/9] md:aspect-[21/9]">
                    {selectedImg ? (
                        <img
                            src={getAssetUrl(selectedImg)}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-subtle">
                            <span className="text-primary/40">No image available</span>
                        </div>
                    )}
                </div>

                {property?.propertyImages && property.propertyImages.length > 0 && (
                    <div className='image-list flex gap-3 mt-4 overflow-x-auto p-2'>
                        {property.propertyImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImg(img.url)}
                                className={`flex-shrink-0 relative rounded-lg overflow-hidden aspect-square transition-all duration-200 w-20 h-20 cursor-pointer ${selectedImg === img.url
                                    ? 'ring-2 ring-primary ring-offset-2'
                                    : 'opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={getAssetUrl(img.url)}
                                    alt={`Property image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Price & Title Section */}
            <div className="price-title-section mb-6 pb-6 border-bottom-border-light">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                            {property.title}
                        </h1>
                        <div className="flex items-center gap-2 text-text/60">
                            <MdLocationOn className="w-5 h-5" />
                            <span>{property.city}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl md:text-4xl font-bold text-primary">
                            {formattedPrice}
                        </p>
                        {property.listingType === "rent" && <p className="text-sm text-text/60">Per month</p>}
                    </div>
                </div>
            </div>

            {/* Amenities Section */}
            <div className="amenities-section mb-8">
                <h2 className="text-lg font-semibold text-primary mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    <div className="amenity-item flex flex-col items-center p-4 bg-surface rounded-lg border border-border-light hover:border-primary/30 transition-colors">
                        <BiBed className="w-6 h-6 text-primary mb-2" />
                        <p className="font-semibold text-primary">{property.bedroom}</p>
                        <p className="text-xs text-text/60">Bedrooms</p>
                    </div>

                    <div className="amenity-item flex flex-col items-center p-4 bg-surface rounded-lg border border-border-light hover:border-primary/30 transition-colors">
                        <BiShower className="w-6 h-6 text-primary mb-2" />
                        <p className="font-semibold text-primary">{property.propertyDetails?.bathroom || 0}</p>
                        <p className="text-xs text-text/60">Bathrooms</p>
                    </div>

                    <div className="amenity-item flex flex-col items-center p-4 bg-surface rounded-lg border border-border-light hover:border-primary/30 transition-colors">
                        <BiRuler className="w-6 h-6 text-primary mb-2" />
                        <p className="font-semibold text-primary">{property.propertyDetails?.areaSqft || 0}</p>
                        <p className="text-xs text-text/60">Super Area</p>
                    </div>

                    <div className="amenity-item flex flex-col items-center p-4 bg-surface rounded-lg border border-border-light hover:border-primary/30 transition-colors">
                        <BsStack className="w-6 h-6 text-primary mb-2" />
                        <p className="font-semibold text-primary">{property.propertyDetails?.floor || 'N/A'}</p>
                        <p className="text-xs text-text/60">Floor</p>
                    </div>

                    <div className="amenity-item flex flex-col items-center p-4 bg-surface rounded-lg border border-border-light hover:border-primary/30 transition-colors">
                        <FaCar className="w-6 h-6 text-primary mb-2" />
                        <p className="font-semibold text-primary">{property.propertyDetails?.parking || 0}</p>
                        <p className="text-xs text-text/60">Parking</p>
                    </div>

                    <div className="amenity-item flex flex-col items-center p-4 bg-surface rounded-lg border border-border-light hover:border-primary/30 transition-colors">
                        <GiSofa className="w-6 h-6 text-primary mb-2" />
                        <p className="font-semibold text-primary">{property.propertyDetails?.furnishingStatus || 'N/A'}</p>
                        <p className="text-xs text-text/60">Furnishing</p>
                    </div>
                </div>
            </div>
            {/* Description Section */}
            <div className="description-section bg-surface rounded-lg p-6 border border-border-light">
                <h2 className="text-lg font-semibold text-primary mb-3">Property Description</h2>
                <p className="text-text/80 leading-relaxed whitespace-pre-wrap">
                    {property.description || 'No description available for this property.'}
                </p>
            </div>

            {
                isMobile && (
                    <InquiryForm propertyId={property.id} />
                )
            }

            <Reviews userId={property?.userId} propertyId={property?.id} />

            
        </div>
    )
}

export default Details