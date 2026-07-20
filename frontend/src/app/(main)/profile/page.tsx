"use client"
import InquiriesReceived from '@/components/profile/InquiriesReceived'
import InquiriesSent from '@/components/profile/InquiriesSent'
import Listings from '@/components/profile/Listings'
import Profile from '@/components/profile/Profile'
import Wishlist from '@/components/profile/Wishlist'
import { useAppContext } from '@/context/AppContext'
import { useProfile } from '@/hooks/useAuth'
import React, { useEffect, useState } from 'react'
import { BiUser, BiHeart, BiSend, BiHome, BiMessageDetail } from 'react-icons/bi'

const Page = () => {
    const { user } = useAppContext()
    const { refetch } = useProfile()
    const [selectedTab, setSelectedTab] = useState<string>("profile")

    useEffect(() => {
        refetch()
    }, [])

    const tabs = [
        {
            label: "Profile",
            tab: "profile",
            icon: <BiUser size={18} />,
            component: <Profile />
        },
        {
            label: "My Wishlist",
            tab: "wishlist",
            icon: <BiHeart size={18} />,
            component: <Wishlist />
        },
        {
            label: "Inquiries Sent",
            tab: "inquiries-sent",
            icon: <BiSend size={18} />,
            component: <InquiriesSent />
        },
        ...(user?.role === "owner"
            ? [
                {
                    label: "My Listings",
                    tab: "my-listings",
                    icon: <BiHome size={18} />,
                    component: <Listings />
                },
                {
                    label: "Inquiries Received",
                    tab: "inquiries-received",
                    icon: <BiMessageDetail size={18} />,
                    component: <InquiriesReceived />
                }
            ]
            : [])
    ];

    const ActiveComponent = tabs.find(
        (tab) => tab.tab === selectedTab
    )?.component

    return (
        <div className="profile-page px-4 py-4">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary">My Account</h1>
                <p className="text-text/60 mt-1">Manage your profile, listings, and inquiries</p>
            </div>

            {/* Horizontal Tabs */}
            <div className="tabs-container mb-8">
                <div className="tabs flex flex-wrap gap-2 w-fit border-bottom-border-light p-1 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.tab}
                            onClick={() => setSelectedTab(tab.tab)}
                            className={`tab flex items-center gap-2 px-5 py-3 transition-all duration-200 whitespace-nowrap cursor-pointer ${selectedTab === tab.tab
                                ? 'active'
                                : ''
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content rounded-xl p-6 min-h-[400px]">
                {ActiveComponent || (
                    <div className="flex items-center justify-center h-full py-20 text-text/60">
                        <p>No content available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page