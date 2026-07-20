"use client"
import React from 'react'
import PropertyCard from '../properties/PropertyCard'
import { useAppContext } from '@/context/AppContext'
import Link from 'next/link'
import { BiHome } from 'react-icons/bi'
import { PiPlus } from 'react-icons/pi'

const Listings = () => {
    const { user } = useAppContext()

    const listings = user?.properties || []

    if (listings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-primary-subtle rounded-full flex items-center justify-center mb-6">
                    <BiHome className="w-12 h-12 text-primary/40" />
                </div>
                <h4 className="text-2xl font-semibold text-primary mb-2">
                    No listings yet
                </h4>
                <p className="text-text/60 max-w-md mb-8">
                    You haven't posted any properties yet. Start by listing your first property
                    and reach potential buyers or tenants.
                </p>
                <Link
                    href="/properties/new"
                    className="btn btn-primary"
                >
                    <PiPlus className="w-5 h-5" />
                    Post Your First Property
                </Link>
            </div>
        )
    }

    return (
        <div className="listings-section">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary">
                    My Listings ({listings.length})
                </h3>
                <Link
                    href="/properties/new"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                    <PiPlus className="w-4 h-4" />
                    Add New Listing
                </Link>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
                {listings.map((property) => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        type='editable'
                    />
                ))}
            </div>
        </div>
    )
}

export default Listings