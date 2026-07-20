import { useAppContext } from '@/context/AppContext'
import React, { useState } from 'react'
import { BiMessage, BiHome, BiTime, BiTrash, BiCheckCircle } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAssetUrl } from '@/utils/getAssetUrl'

const InquiriesSent = () => {
    const { user, isMobile } = useAppContext()
    const router = useRouter()

    if (!user || !user.inquiries || user.inquiries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                <div className="w-20 h-20 bg-primary-subtle rounded-full flex items-center justify-center mb-4">
                    <BiMessage className="w-10 h-10 text-primary/40" />
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">No inquiries sent</h4>
                <p className="text-text/60 max-w-md mb-8">
                    You haven't sent any inquiries yet. Start exploring properties and send your first inquiry!
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700'
            case 'answered':
                return 'bg-green-100 text-green-700'
            case 'closed':
                return 'bg-gray-100 text-gray-700'
            default:
                return 'bg-primary/10 text-primary'
        }
    }

    return (
        <div className="inquiries-sent">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">
                    Sent Inquiries ({user.inquiries.length})
                </h3>
            </div>

            {/* Inquiries List */}
            <div className="space-y-3">
                {user.inquiries.map((inquiry) => {
                    const coverImg = inquiry.property?.propertyImages?.find(i => i.isCover === true)
                    return (
                        <div
                            key={inquiry.id}
                            className="inquiry-item bg-surface/50 rounded-lg border border-border-light hover:border-primary/20 transition-all duration-200 p-4 cursor-pointer"
                            onClick={() => router.push(`/properties/${inquiry?.property?.id}`)}
                        >
                            <div className="flex items-start gap-3">
                                {/* Property Image */}
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-primary-subtle">
                                    {coverImg?.url ? (
                                        <img
                                            src={getAssetUrl(coverImg?.url)}
                                            alt={inquiry?.property?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BiHome className="w-6 h-6 text-primary/40" />
                                        </div>
                                    )}
                                </div>

                                {/* Inquiry Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-medium text-primary truncate">
                                                {inquiry.property?.title || 'Unknown Property'}
                                            </h4>
                                            <p className="text-xs text-text/60">
                                                {inquiry.property?.city || 'Location unavailable'}
                                            </p>
                                        </div>
                                        {!isMobile && (
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                    {inquiry.status || 'Pending'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {isMobile && (
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status || 'Pending'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-2">
                                        <p className="text-sm text-text/80 line-clamp-2">
                                            {inquiry.message || 'No message provided'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2 text-xs text-text/40">
                                        <span className="flex items-center gap-1">
                                            <BiTime className="w-3 h-3" />
                                            {formatDate(inquiry.createdAt || new Date().toISOString())}
                                        </span>
                                        {inquiry.property?.price && (
                                            <span className="flex items-center gap-1">
                                                <span>₹{inquiry.property.price.toLocaleString()}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default InquiriesSent