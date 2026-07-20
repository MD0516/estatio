"use client"
import { useAppContext } from '@/context/AppContext'
import React from 'react'
import PropertyCard from '../properties/PropertyCard'
import { BiHeart } from 'react-icons/bi'
import Link from 'next/link'

const Wishlist = () => {
    const { user } = useAppContext()

    const wishlistItems = user?.wishlist || []

    if (wishlistItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-primary-subtle rounded-full flex items-center justify-center mb-6">
                    <BiHeart className="w-12 h-12 text-primary/40" />
                </div>
                <h4 className="text-2xl font-semibold text-primary mb-2">
                    Your wishlist is empty
                </h4>
                <p className="text-text/60 max-w-md mb-8">
                    Save your favorite properties by clicking the heart icon on any property card.
                    They'll appear here for easy access.
                </p>
                <Link
                    href="/properties"
                    className="btn btn-primary"
                >
                    Browse Properties
                </Link>
            </div>
        )
    }

    return (
        <div className='wishlist-grid'>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary">
                    My Wishlist ({wishlistItems.length})
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {wishlistItems.map((wishlist) =>
                    wishlist.property ? (
                        <PropertyCard
                            key={wishlist.property.id}
                            property={wishlist.property}
                            type="wishlist"
                        />
                    ) : null
                )}
            </div>
        </div>
    )
}

export default Wishlist