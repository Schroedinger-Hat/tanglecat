'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import CurveIllustration from './curveIllustration'
import HamburgerIcon from './hamburgerIcon'
import Sidebar from './sidebar'

const WaveHeader = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="relative w-full">
            <div className="py-4">
                <div className="relative flex justify-between items-center mx-4">
                    <button
                        className="text-slate-900 hover:bg-white/20 rounded-lg transition-colors p-2"
                        aria-label="Open menu"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <HamburgerIcon />
                    </button>
                    <Link href="/">
                        <Image src="/static/logo.svg" alt="Tech Event Challenge" width={35} height={35} />
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