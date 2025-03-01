'use client'

import Link from 'next/link'
import { useState } from 'react'
import CurveIllustration from './curveIllustration'
import HamburgerIcon from './hamburgerIcon'
import Logo from './logo'
import Sidebar from './sidebar'

const WaveHeader = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="relative w-full bg-black">
            <div className="py-4">
                <div className="relative flex justify-between items-center mx-4">
                    <button
                        className="text-slate-900 hover:bg-black/20 text-white rounded-lg transition-colors p-2"
                        aria-label="Open menu"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <HamburgerIcon />
                    </button>
                    <Link href="/" className='invert'>
                        <Logo />
                    </Link>
                </div>
                <CurveIllustration />
            </div>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div>
    )
}

export default WaveHeader