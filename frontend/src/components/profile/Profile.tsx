"use client"

import { useAppContext } from "@/context/AppContext"
import { BiUser, BiEnvelope, BiPhone, BiCalendar, BiMapPin, BiBadge } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'

const Profile = () => {
    const { user } = useAppContext();

    if (!user) {
        return (
            <div className="flex items-center justify-center py-12 text-text/60">
                <p>Please log in to view your profile</p>
            </div>
        )
    }

    // Format join date (if available)
    const formatDate = (date?: string) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="profile-section">
            {/* Profile Header */}
            <div className="profile-header flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8 pb-8 border-bottom-border-light">
                <div className="avatar-wrapper flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-primary-subtle flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>

                <div className="profile-info flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-primary flex items-center justify-center sm:justify-start gap-2">
                        {user.name || 'User'}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {user.role || 'Member'}
                        </span>
                    </h2>
                    <p className="text-text/60 text-sm mt-1">
                        Member since {formatDate(user.createdAt)}
                    </p>
                </div>
            </div>

            {/* Profile Details */}
            <div className="profile-details grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Card */}
                <div className="detail-card p-4 bg-surface/50 rounded-lg border border-border-light hover:border-primary/20 transition-all duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BiUser className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text/40 uppercase tracking-wider font-medium">Full Name</p>
                            <p className="text-sm font-medium text-primary">{user.name || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Email Card */}
                <div className="detail-card p-4 bg-surface/50 rounded-lg border border-border-light hover:border-primary/20 transition-all duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BiEnvelope className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text/40 uppercase tracking-wider font-medium">Email Address</p>
                            <p className="text-sm font-medium text-primary">{user.email || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Phone Card */}
                <div className="detail-card p-4 bg-surface/50 rounded-lg border border-border-light hover:border-primary/20 transition-all duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BiPhone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text/40 uppercase tracking-wider font-medium">Phone Number</p>
                            <p className="text-sm font-medium text-primary">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Role Card */}
                <div className="detail-card p-4 bg-surface/50 rounded-lg border border-border-light hover:border-primary/20 transition-all duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BiBadge className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text/40 uppercase tracking-wider font-medium">Account Type</p>
                            <p className="text-sm font-medium text-primary capitalize">{user.role || 'Member'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Stats (optional) */}
            <div className="account-stats grid grid-cols-3 gap-4 mt-8 pt-8 border-top-border-light">
                <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{user?.properties.length}</p>
                    <p className="text-xs text-text/60">Listings</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{user?.inquiries.length}</p>
                    <p className="text-xs text-text/60">Inquiries</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{user?.reviews.length}</p>
                    <p className="text-xs text-text/60">Reviews</p>
                </div>
            </div>
        </div>
    )
}

export default Profile