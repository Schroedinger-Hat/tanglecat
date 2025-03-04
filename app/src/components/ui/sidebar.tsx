"use client"

import Link from "next/link"
import { Button } from "./button"
import CrossIcon from "./crossIcon"
import CurveIllustration from "./curveIllustration"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  if (!isOpen) return null
  const isSupervisor = document.cookie.includes("supervisor_token")

  const signOut = () => {
    // unset the user cookie
    document.cookie =
      "user_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    document.cookie =
      "supervisor_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    // redirect to the home page via window.location.href
    window.location.href = "/"
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed bg-primary inset-y-0 left-0 w-64 z-50 border-r-2 border-b-2 border-black transform transition-transform duration-300 ease-in-out rounded-tr-2xl rounded-br-2xl">
        <div className="bg-secondary w-full h-8 py-7 rounded-tr-2xl">
          <div className="text-primary mt-4">
            <CurveIllustration />
          </div>
        </div>
        <div className="p-5 space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 font-bold uppercase hover:text-gray-700 text-white"
            aria-label="Close menu"
          >
            <CrossIcon />
          </button>

          <nav className="text-secondary space-y-2">
            <Link
              href={isSupervisor ? "/admin" : "/dashboard"}
              className="text-secondary block px-4 py-2 font-bold uppercase hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard?view=leaderboard"
              className="text-secondary block px-4 py-2 font-bold uppercase hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Leaderboard
            </Link>
            <Link
              href="/dashboard?view=challenges"
              className="text-secondary block px-4 py-2 font-bold uppercase hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Challenges
            </Link>
            <Link
              href="/dashboard?view=award"
              className="text-secondary block px-4 py-2 font-bold uppercase hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Awards
            </Link>
            <Link
              href="https://osday.dev/schedule"
              target="_blank"
              className="text-secondary block px-4 py-2 font-bold uppercase hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              OSDay Schedule
            </Link>
            <Link
              href="https://osday.dev/jobs"
              target="_blank"
              className="text-secondary block px-4 py-2 font-bold uppercase hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              OSDay Jobs
            </Link>
            <Button
              size="sm"
              variant="danger"
              onClick={signOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar