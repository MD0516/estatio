import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import React from 'react'

const layout = ({
    children
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <div className="min-h-full flex flex-col main">
            <Header />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default layout