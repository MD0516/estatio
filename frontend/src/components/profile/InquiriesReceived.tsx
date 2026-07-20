import { useAppContext } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BiMessage, BiHome, BiTime, BiCheckCircle, BiTrash, BiReply, BiUser, BiPhone } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'
import { useInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiry'
import { InquiryStatus } from '@/types'

const InquiriesReceived = () => {
    const router = useRouter()
    const { data: inquiries = [] } = useInquiries()
    const { mutate: updateStatus } = useUpdateInquiryStatus()
    const { isMobile } = useAppContext()
    
    if (inquiries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-primary-subtle rounded-full flex items-center justify-center mb-4">
                    <BiMessage className="w-10 h-10 text-primary/40" />
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">No inquiries received</h4>
                <p className="text-text/60 max-w-md">
                    You haven't received any inquiries for your properties yet.
                </p>
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

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700'
            case 'responded':
                return 'bg-green-100 text-green-700'
            case 'closed':
                return 'bg-gray-100 text-gray-700'
            default:
                return 'bg-primary/10 text-primary'
        }
    }

    const handleStatusChange = (inquiryId: number, newStatus: InquiryStatus) => {
        const payload = {
            id: inquiryId,
            status: newStatus
        }

        updateStatus(payload)
    }

    return (
        <div className="inquiries-received space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">
                    Received Inquiries ({inquiries.length})
                </h3>
            </div>

            {/* Inquiries List */}
            <div className="space-y-3">
                {inquiries.map((inquiry) => (
                    <div
                        key={inquiry.id}
                        className="inquiry-item bg-surface/50 rounded-lg border border-border-light hover:border-primary/20 transition-all duration-200 p-4"
                    >
                        <div className="flex items-start gap-4">
                            {/* User Avatar */}

                            {!isMobile && (
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-secondary-subtle flex items-center justify-center text-secondary font-bold">
                                        {inquiry?.user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                </div>
                            )}
                            {/* Inquiry Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="text-sm font-medium text-primary">
                                            {inquiry?.user?.name || "Anonymous User"}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-text/60">
                                            <span className="flex items-center gap-1">
                                                <BiPhone className="w-3 h-3" />
                                                {inquiry?.user?.phone}
                                            </span>
                                            <span className="text-text/30">•</span>
                                            <span className="flex items-center gap-1">
                                                <BiTime className="w-3 h-3" />
                                                {formatDate(inquiry.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Property Info */}
                                {inquiry.property?.title || inquiry.property?.city &&
                                    <div className="mt-2 flex items-center gap-2 text-xs text-text/60">
                                        <BiHome className="w-3 h-3" />
                                        <span>{inquiry.property.title}</span>
                                        <span className="text-text/30">•</span>
                                        <span>{inquiry.property.city}</span>
                                    </div>
                                }
                                {/* Message */}
                                <div className="mt-2 p-3 bg-surface rounded-lg border border-border-light">
                                    <p className="text-sm text-text/80">
                                        "{inquiry.message}"
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 mt-3">
                                    <select
                                        value={inquiry.status}
                                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value as InquiryStatus)}
                                        className="px-3 py-1.5 bg-surface border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="responded">Responded</option>
                                        <option value="closed">Closed</option>
                                    </select>

                                    <button
                                        onClick={() => router.push(`/properties/${inquiry.propertyId}`)}
                                        className="btn btn-secondary-outline btn-sm flex items-center gap-1"
                                    >
                                        <BiHome className="w-3.5 h-3.5" />
                                        View Property
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InquiriesReceived