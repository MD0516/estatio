import { useSimilarProperties } from '@/hooks/useProperty'
import React from 'react'
import PropertyCard from '../PropertyCard'
import { BiLoaderCircle, BiHome } from 'react-icons/bi'
import Link from 'next/link'

type SimilarPropertiesProps = {
    propertyId: number
}

const SimilarProperties = ({
    propertyId
}: Readonly<SimilarPropertiesProps>) => {
    const { data: properties, isLoading } = useSimilarProperties(propertyId)

    // Loading State
    if (isLoading) {
        return (
            <div className="similar-properties-section">
                <h3 className="text-2xl font-bold text-primary mb-4">Similar Properties</h3>
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <BiLoaderCircle className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-text/60 text-sm">Loading similar properties...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Empty State
    if (!properties || properties.length === 0) {
        return (
            <div className="similar-properties-section">
                <h3 className="text-2xl font-bold text-primary mb-4">Similar Properties</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center bg-surface/30 rounded-xl border border-border-light border-dashed">
                    <div className="w-16 h-16 bg-primary-subtle rounded-full flex items-center justify-center mb-3">
                        <BiHome className="w-8 h-8 text-primary/40" />
                    </div>
                    <h4 className="text-lg font-semibold text-primary mb-1">No similar properties</h4>
                    <p className="text-text/60 max-w-md text-sm">
                        We couldn't find any properties similar to this one at the moment.
                    </p>
                    <Link 
                        href="/properties"
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 text-sm"
                    >
                        Browse All Properties
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="similar-properties-section">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-primary">Similar Properties</h3>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {properties.map((property) => (
                        <div 
                            key={property.id} 
                            className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] snap-start"
                        >
                            <PropertyCard property={property} />
                        </div>
                    ))}
                </div>
                
                {/* Gradient Fade Effect (Optional) */}
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
            </div>
        </div>
    )
}

export default SimilarProperties