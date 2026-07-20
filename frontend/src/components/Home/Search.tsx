"use client"
import { useAppContext } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsHouse } from 'react-icons/bs'
import { ImLocation } from 'react-icons/im'
import { toast } from 'sonner'

const Search = () => {
    const { isMobile } = useAppContext()
    const router = useRouter()
    const [city, setCity] = useState("");
    const [propertyType, setPropertyType] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (city.trim()) {
            params.set("city", city.trim());
        }

        if (propertyType) {
            params.set("type", propertyType);
        }

        router.push(`/properties?${params.toString()}`);
    };
    return (
        <div className='search flex flex-col gap-8 items-center justify-center mt-10 px-4'>
            <div className={`hero text-center p-4 ${isMobile && "max-w-2xl"}`}>
                <h1 className={`font-semibold ${isMobile && "text-4xl"} text-text tracking-tight`}>
                    Find your perfect home
                </h1>
                <p className='mt-3 text-lg text-text/70 max-w-md mx-auto'>
                    Discover thousands of properties in India's top cities with trusted listings.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="search-bar flex flex-wrap lg:flex-nowrap gap-4 items-center p-3 w-full max-w-4xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative flex-[3] min-w-[200px]">
                    <ImLocation size={22} className='absolute left-4 top-1/2 -translate-y-1/2 text-primary/60' />
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder='Enter City...'
                        className='w-full pl-12 pr-4'
                    />
                </div>

                <div className="relative flex-[2] min-w-[160px]">
                    <BsHouse size={22} className='absolute left-4 top-1/2 -translate-y-1/2 text-primary/60' />
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value.toLowerCase())}
                        className="w-full pl-12 pr-4 appearance-none cursor-pointer"
                    >
                        <option value="">Property Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="house">House</option>
                        <option value="plot">Plot</option>
                        <option value="commercial">Commercial</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <button className='flex-1 min-w-[120px] btn btn-primary py-3 px-6 rounded-lg font-medium hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2'>
                    <BiSearch size={20} />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Search