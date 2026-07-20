import React from 'react'
import PropertyCard from './PropertyCard'
import { BsHouse } from 'react-icons/bs'
import { BiLoaderCircle } from 'react-icons/bi'
import { Property } from '@/types/property'

type PropertyGridProps = {
    properties: Property[]
    total: number
    page: number
    totalPages: number
    onPageChange: (page: number) => void,
    isLoading: boolean
}

const PropertyGrid = ({
    properties,
    total,
    page,
    totalPages,
    onPageChange,
    isLoading
}: Readonly<PropertyGridProps>) => {
    // Generate pagination range
    const getPaginationRange = () => {
        const delta = 2
        const range = []
        const rangeWithDots: (number | string)[] = []
        let l: number

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
                range.push(i)
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1)
                } else if (i - l !== 1) {
                    rangeWithDots.push('...')
                }
            }
            rangeWithDots.push(i)
            l = i
        })

        return rangeWithDots
    }

    // Loading state
    if (isLoading) {
        return (
            <div className='property-grid flex-1 flex flex-col px-4 md:px-6'>
                <div className="flex items-center justify-center py-20 flex-1">
                    <div className="flex flex-col items-center gap-3">
                        <BiLoaderCircle className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-text/60 text-sm">Loading properties...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='property-grid flex-1 flex flex-col px-4 md:px-6'>
            {/* Header Section */}
            <div className="header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-bottom-border-light">
                <div className="header-content">
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-1">
                        Properties for type
                    </h3>
                    <p className="text-text/60 text-sm md:text-base">
                        Showing {properties.length} of {total} results matching your criteria
                    </p>
                </div>
            </div>

            {/* Grid Section */}
            <div className="flex-1 flex flex-col">
                {properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
                        <div className="w-20 h-20 bg-primary-subtle rounded-full flex items-center justify-center mb-4">
                            <BsHouse className="w-10 h-10 text-primary/40" />
                        </div>
                        <h4 className="text-xl font-semibold text-primary mb-2">No properties found</h4>
                        <p className="text-text/60 max-w-md">
                            Try adjusting your filters or search criteria to find more properties.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 pt-8 border-top-border-light">
                                <nav className="flex items-center gap-2" aria-label="Pagination">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => onPageChange(page - 1)}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-surface border border-border-light rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary cursor-pointer"
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {getPaginationRange().map((item, index) => (
                                        <React.Fragment key={index}>
                                            {item === '...' ? (
                                                <span className="px-3 py-2 text-text/60 text-sm">...</span>
                                            ) : (
                                                <button
                                                    onClick={() => onPageChange(item as number)}
                                                    className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${item === page
                                                            ? 'bg-primary text-white'
                                                            : 'bg-surface border border-border-light hover:bg-primary'
                                                        }`}
                                                >
                                                    {item}
                                                </button>
                                            )}
                                        </React.Fragment>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => onPageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-surface border border-border-light rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default PropertyGrid