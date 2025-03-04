import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'

interface BaseListItemProps {
  className?: string
}

interface ChallengeListItemProps extends BaseListItemProps {
  type: 'challenge'
  href: string
  title: string
  description: string
  points: number
  isCompleted?: boolean
  isSupervised?: boolean
  isOnline?: boolean
  webhook?: string
}

interface LeaderboardListItemProps extends BaseListItemProps {
  type: 'leaderboard'
  position: number
  name: string
  points: number
  isCurrentUser?: boolean
}

interface AwardListItemProps extends BaseListItemProps {
  type: 'award'
  href: string
  title: string
  description: string
  points: number
  imageUrl: string
  isCompleted?: boolean
  isSupervised?: boolean
}

type ListItemProps = ChallengeListItemProps | LeaderboardListItemProps | AwardListItemProps

const ListItem = React.forwardRef<HTMLElement, ListItemProps>(
  (props, ref) => {
    const baseClasses = `
      block
      w-full
      p-4
      bg-neutral-50
      text-neutral-950
      border-2
      border-neutral-950
      rounded-2xl
      shadow-[4px_4px_0px_0px_rgba(23,23,23)]
      transition-all
      duration-200

      hover:shadow-[2px_2px_0px_0px_rgba(23,23,23)]
      hover:translate-x-[2px]
      hover:translate-y-[2px]

      active:shadow-none
      active:translate-x-[4px]
      active:translate-y-[4px]

      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-neutral-950
      focus-visible:ring-offset-2

      disabled:pointer-events-none
      disabled:opacity-50
    `

    if (props.type === 'challenge') {
      const { href, title, description, points, isCompleted, className = '' } = props

      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={`
            ${baseClasses}
            ${isCompleted ? 'border-green-500 bg-slate-200' : ''}
            ${className}
          `}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Image
                  src={`https://api.dicebear.com/9.x/glass/png?seed=${props.isSupervised ? 'supervised' : props.isOnline ? 'online' : props.webhook ? 'webhook' : 'self-check'}`}
                  alt="Challenge type"
                  width={24}
                  height={24}
                />
                {title}
              </h3>
            </div>
            <div className="flex items-center justify-center flex-col gap-2">
                <span className="text-center font-bold text-blue-600 shrink-0">
                    {points} pts
                </span>
                {isCompleted && (
                    <CheckCircle2
                    className="w-5 h-5 text-green-500 shrink-0"
                    aria-label="Completed"
                    />
                )}
            </div>
          </div>
        <div className="flex-1 flex-row">
            <p className="text-neutral-600 text-sm">
            {description}
            </p>
        </div>
        </Link>
      )
    }

    if (props.type === 'leaderboard') {
      const { position, name, points, isCurrentUser, className = '' } = props

      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={`
            ${baseClasses}
            ${isCurrentUser ? '[&&]:bg-blue-100' : ''}
            ${className}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-gray-500 w-8">
                {position}
              </span>
              <div className="relative w-12 h-12">
                <Image
                  src={`https://api.dicebear.com/7.x/bottts-neutral/png?seed=${name}`}
                  alt={name}
                  className="rounded-full"
                  fill
                />
              </div>
              <span className="font-semibold">{name}</span>
            </div>
            <span className="font-bold text-blue-600 shrink-0">
              {points} pts
            </span>
          </div>
        </div>
      )
    }

    const { href, title, description, points, imageUrl, isCompleted, isSupervised, className = '' } = props as AwardListItemProps

    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={`
          ${baseClasses}
          ${isCompleted ? 'border-green-500 bg-slate-200' : ''}
          ${className}
        `}
      >
        <div className="flex gap-4">
          <div className="w-24 h-24 relative flex-shrink-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {title}
                {isCompleted && (
                  <CheckCircle2
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    aria-label="Completed"
                  />
                )}
              </h3>
              <p className="text-neutral-600 text-sm">
                {description}
              </p>
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600">
                  {points} pts
                </span>
                {isSupervised && !isCompleted && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Requires Verification
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
)

ListItem.displayName = 'ListItem'

export { ListItem }
export type { ListItemProps, ChallengeListItemProps, LeaderboardListItemProps, AwardListItemProps }