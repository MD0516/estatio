"use client"
import React from 'react'
import Details from './Details'
import InquiryForm from './InquiryForm'
import { useAppContext } from '@/context/AppContext'
import { useProperty } from '@/hooks/useProperty'
import { useParams } from 'next/navigation'
import { BiHome, BiLoaderCircle } from 'react-icons/bi'
import { Property } from '@/types'
import SimilarProperties from './SimilarProperties'

type DetailsPageProps = {
    initialData: Property | null;
    propertyId: number
}

const DetailsPage = ({
    initialData,
    propertyId
}: Readonly<DetailsPageProps>) => {
    const { isMobile } = useAppContext()
    const { data: property, isLoading } = useProperty(propertyId, { initialData: initialData ?? undefined })

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
        <div className="details-page max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* Left Column - Property Details */}
                <div className="flex-1 min-w-0">
                    <Details property={property} />
                </div>

                {/* Right Column - Inquiry Form (Desktop) */}
                {!isMobile && (
                    <div className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0">
                        <InquiryForm propertyId={property.id} />
                    </div>
                )}
            </div>

            <div className="border-top-border-light mt-8 pt-8">
                <SimilarProperties propertyId={propertyId} />
            </div>
        </div>
    )
}

export default DetailsPage