import Image from 'next/image'
import Link from 'next/link'

const WaveHeader = () => {
    return (
        <div className="relative w-full">
            <div className="bg-yellow-400 py-4">
                <div className="relative flex justify-between items-center mx-4">
                    <button
                        className=" text-white hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Open menu"
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
                <div className="-mb-6 w-full overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            strokeWidth="4"
                            strokeLinecap="round"
                            d="M0 34.9866C106.667 44.9999 213.333 0.999901 320 0.999901C426.667 0.999901 533.333 34.9999 640 34.9999C746.667 34.9999 853.333 0.999901 960 0.999901C1066.67 0.999901 1173.33 34.9999 1280 34.9999C1386.67 34.9999 1440 10.0266 1440 0.0133V92H0V34.9866Z"
                            className="fill-current text-pink-400"
                            pathLength="4"
                            stroke="#000"
                            strokeDasharray="2 2 2 3" 
                            strokeDashoffset="0"
                        />
                    </svg>
                </div>
            </div>

        </div>
    )
}

export default WaveHeader