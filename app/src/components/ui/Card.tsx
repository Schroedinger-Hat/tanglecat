import * as React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'celebration'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', variant = 'default' }, ref) => {
    const baseClasses = `
      w-full
      bg-neutral-50
      text-neutral-950
      border-2
      border-neutral-950
      rounded-2xl
      shadow-[4px_4px_0px_0px_rgba(23,23,23)]
      transition-all
      duration-200
    `

    const variantClasses = {
      default: 'p-6',
      celebration: 'p-8 text-center'
    }

    return (
      <div
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${className}
        `}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Sub-components for better organization
const CardHeader = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`flex gap-6 mb-6 ${className}`}>
    {children}
  </div>
)

const CardContent = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`prose max-w-none ${className}`}>
    {children}
  </div>
)

const CardFooter = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`space-y-4 mt-6 ${className}`}>
    {children}
  </div>
)

const CardSection = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`bg-neutral-100 p-4 rounded-lg ${className}`}>
    {children}
  </div>
)

export { Card, CardHeader, CardContent, CardFooter, CardSection }