"use client"

import { useAppContext } from '@/context/AppContext'
import { useDeleteProperty } from '@/hooks/useProperty'
import { useAddWishlist } from '@/hooks/useWishlist'
import { Property } from '@/types'
import { getAssetUrl } from '@/utils/getAssetUrl'
import { useRouter } from 'next/navigation'
import React from 'react'
import { BiArea, BiBed, BiEdit, BiHome, BiShower } from 'react-icons/bi'
import { FiHeart, FiX } from 'react-icons/fi'
import { MdLocationOn } from 'react-icons/md'

type PropertyCardProps = {
    property: Property,
    type?: string
}

const PropertyCard = ({
    property,
    type
}: Readonly<PropertyCardProps>) => {
    const { user } = useAppContext()
    const { mutate: toggleWishlist } = useAddWishlist()
    const { mutate: deleteProperty } = useDeleteProperty()
    const router = useRouter()
    const coverImg = property?.propertyImages?.find((i) => i.isCover === true)

    const isWishlist = property.wishlist
        ?.map((w) => w.userId)
        .includes(user?.id);

    const handleWishlist = (propertyId: number) => {
        if (!user) return;
        toggleWishlist({ propertyId })
    }

    // Format price with proper currency
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(property.price || 0)

    return (
        <div
            className='property-card group bg-surface rounded-xl overflow-hidden border border-border-light hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer'
            onClick={() => router.push(`/properties/${property.id}`)}
        >
            {/* Image Section */}
            <div className="property-img relative h-64 overflow-hidden bg-primary-subtle">
                {coverImg?.url ? (
                    <img
                        src={getAssetUrl(coverImg.url)}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                        <div className="flex flex-col items-center gap-3">
                            <BiHome className="w-16 h-16 text-primary/20" />
                            <span className="text-xs text-primary/30 font-medium">No image available</span>
                        </div>
                    </div>
                )}

                {/* Property Type Badge */}
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary shadow-sm">
                        {property.listingType === 'rent' ? 'For Rent' :
                            property.listingType === 'sale' ? 'For Sale' :
                                property.listingType === 'lease' ? 'For Lease' : 'Property'}
                    </span>
                </div>

                {/* Action Buttons - Edit, Delete & Wishlist */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {type === "editable" && (
                        <>
                            {/* Edit Button */}
                            <button
                                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-200 hover:scale-110 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/properties/${property.id}/edit`)
                                }}
                            >
                                <BiEdit className="w-5 h-5" />
                            </button>

                            {/* Delete Button */}
                            <button
                                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (confirm('Are you sure you want to delete this property?')) {
                                        deleteProperty(property.id)
                                    }
                                }}
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {type !== "wishlist" && type !== "editable" && (
                        <button
                            className={`wishlist p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${isWishlist
                                ? 'bg-primary text-white hover:bg-primary-dark'
                                : 'hover:bg-primary hover:text-white'
                                }`}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleWishlist(property.id)
                            }}
                        >
                            <FiHeart className={`w-5 h-5 ${isWishlist ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                {/* Price & Title */}
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-primary line-clamp-1 flex-1 leading-tight">
                            {property.title}
                        </h3>
                        <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-primary">
                                {formattedPrice}
                            </p>
                            {property.listingType === "rent" && (
                                <p className="text-[10px] text-text/50 font-medium">per month</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-text/60 text-sm">
                        <MdLocationOn className="w-4 h-4 text-primary/50 flex-shrink-0" />
                        <span className="truncate">{property.city}</span>
                    </div>
                </div>

                {/* Amenities */}
                <div className='flex flex-wrap gap-2 pt-3 border-top-border-light'>
                    {property.propertyDetails?.bedroom ? (
                        <div className="flex items-center gap-1 text-xs text-text/70 bg-primary/5 px-2.5 py-1 rounded-full">
                            <BiBed className="w-3.5 h-3.5 text-primary" />
                            <span>{property.propertyDetails.bedroom}</span>
                        </div>
                    ) : <></>}
                    {property.propertyDetails?.bathroom ? (
                        <div className="flex items-center gap-1 text-xs text-text/70 bg-primary/5 px-2.5 py-1 rounded-full">
                            <BiShower className="w-3.5 h-3.5 text-primary" />
                            <span>{property.propertyDetails.bathroom}</span>
                        </div>
                    ) : <></>}
                    <div className="flex items-center gap-1 text-xs text-text/70 bg-primary/5 px-2.5 py-1 rounded-full">
                        <BiArea className="w-3.5 h-3.5 text-primary" />
                        <span>{property.propertyDetails?.areaSqft} sqft</span>
                    </div>
                </div>

                {/* Additional details */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {property.propertyDetails?.furnishingStatus && (
                        <span className="px-2 py-0.5 bg-primary-subtle text-primary text-[10px] font-medium rounded-full">
                            {property.propertyDetails.furnishingStatus}
                        </span>
                    )}
                    {property.propertyDetails?.floor ? (
                        <span className="px-2 py-0.5 bg-primary-subtle text-primary text-[10px] font-medium rounded-full">
                            Floor {property.propertyDetails.floor}
                        </span>
                    ) : <></>}
                    {property.propertyDetails?.parking && property.propertyDetails.parking !== 'none' && (
                        <span className="px-2 py-0.5 bg-primary-subtle text-primary text-[10px] font-medium rounded-full">
                            {property.propertyDetails.parking === 'car' ? 'Car Parking' :
                                property.propertyDetails.parking === 'bike' ? 'Bike Parking' :
                                    property.propertyDetails.parking === 'both' ? 'Car & Bike' : 'Parking'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PropertyCard