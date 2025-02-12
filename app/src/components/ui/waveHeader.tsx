'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import CurveIllustration from './curveIllustration'
import Sidebar from './sidebar'

const WaveHeader = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="relative w-full">
            <div className="bg-yellow-400 py-4">
                <div className="relative flex justify-between items-center mx-4">
                    <button
                        className="text-slate-900 hover:bg-white/20 rounded-lg transition-colors p-2"
                        aria-label="Open menu"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
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