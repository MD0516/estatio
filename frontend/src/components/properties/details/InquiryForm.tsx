"use client"
import { useAppContext } from '@/context/AppContext'
import { useCreateInquiry } from '@/hooks/useInquiry'
import React, { useState } from 'react'
import { BiSend, BiCheckCircle, BiTime } from 'react-icons/bi'
import { MdPerson, MdEmail } from 'react-icons/md'

type InquiryFormProps = {
    propertyId: number
}

const InquiryForm = ({
    propertyId
}: Readonly<InquiryFormProps>) => {
    const { user } = useAppContext()
    const [message, setMessage] = useState("I'm interested in this property. Please contact me.")
    
    const isAlreadySubmitted = user?.inquiries?.some(i => i.propertyId === propertyId) || false
    
    const existingInquiry = user?.inquiries?.find(i => i.propertyId === propertyId)
    
    const { mutate: createInquiry, isPending } = useCreateInquiry()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || isAlreadySubmitted) return

        const payload = {
            propertyId,
            message
        }

        createInquiry(payload)
    }

    // Already submitted state
    if (isAlreadySubmitted && user) {
        return (
            <div className="inquiry-form w-xl bg-surface rounded-xl border border-border-light shadow overflow-hidden my-4">
                {/* Header */}
                <div className="hero p-6 border-b border-border-light bg-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <BiCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary">
                                Inquiry Sent
                            </h3>
                            <p className="text-sm text-text/60">
                                You've already contacted the owner of this property
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <BiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    Your inquiry has been sent
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    The owner will respond to your inquiry within 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Existing inquiry details */}
                    {existingInquiry && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-text/60">
                                <BiTime className="w-4 h-4" />
                                <span>
                                    Sent on {new Date(existingInquiry.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            
                            <div className="bg-surface rounded-lg border border-border-light p-4">
                                <p className="text-sm text-text/80">
                                    "{existingInquiry.message}"
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                    {existingInquiry.status || 'Pending'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="inquiry-form w-xl bg-surface rounded-xl border border-border-light shadow overflow-hidden my-4">
            {/* Header */}
            <div className="hero p-6 border-b border-border-light bg-primary-subtle/30">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MdPerson className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-primary">
                            {user?.name || 'Property Owner'}
                        </h3>
                        <p className="text-sm text-text/60">
                            {user ? 'Response within 24 hours' : 'Sign in to contact owner'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-4">
                    <h4 className="text-base font-medium text-primary mb-1">
                        Interested in this property?
                    </h4>
                    <p className="text-sm text-text/60">
                        Send a message to the owner to express your interest
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Message Input */}
                    <div className="relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-background border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none text-text/80 placeholder:text-text/40"
                            placeholder="Write your message here..."
                            disabled={!user}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-text/30">
                            {message.length} / 500
                        </div>
                    </div>

                    {/* User Info (if logged in) */}
                    {user && (
                        <div className="flex flex-wrap gap-4 text-sm text-text/60 bg-primary-subtle/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <MdPerson className="w-4 h-4" />
                                <span>{user.name || 'Your Name'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MdEmail className="w-4 h-4" />
                                <span>{user.email || 'your@email.com'}</span>
                            </div>
                        </div>
                    )}

                    {/* Login Prompt */}
                    {!user && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm text-primary/80">
                                <span className="font-medium">Please log in</span> to send an inquiry to the owner
                            </p>
                            <button 
                                type="button"
                                className="mt-2 text-sm font-medium text-primary hover:underline"
                                onClick={() => window.location.href = '/login'}
                            >
                                Log in now
                            </button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!user || isPending || !message.trim()}
                        className="w-full btn btn-primary py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <BiSend className="w-5 h-5" />
                                Send Inquiry
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default InquiryForm