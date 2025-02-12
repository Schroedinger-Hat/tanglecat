import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'accent'
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', size = 'default', variant = 'default', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-10 px-6 text-sm',
      default: 'h-14 px-8 text-base', 
      lg: 'h-16 px-10 text-lg'
    }

    const variantClasses = {
      default: `
        bg-neutral-50
        text-neutral-950
        border-2
        border-neutral-950
        shadow-[4px_4px_0px_0px_rgba(23,23,23)]
        hover:shadow-[2px_2px_0px_0px_rgba(23,23,23)]
        hover:translate-x-[2px]
        hover:translate-y-[2px]
        active:shadow-none
        active:translate-x-[4px]
        active:translate-y-[4px]
      `,
      accent: `
        bg-blue-600
        text-white
        border-2
        border-neutral-950
        shadow-[4px_4px_0px_0px_rgba(23,23,23)]
        hover:bg-blue-700
        hover:shadow-[2px_2px_0px_0px_rgba(23,23,23)]
        hover:translate-x-[2px]
        hover:translate-y-[2px]
        active:shadow-none
        active:translate-x-[4px]
        active:translate-y-[4px]
      `,
      danger: `
        bg-red-500
        text-white
        border-2
        border-neutral-950
        shadow-[4px_4px_0px_0px_rgba(23,23,23)]
        hover:bg-red-600
        hover:shadow-[2px_2px_0px_0px_rgba(23,23,23)]
        hover:translate-x-[2px]
        hover:translate-y-[2px]
        active:shadow-none
        active:translate-x-[4px]
        active:translate-y-[4px]
      `,
    }

    return (
      <button
        ref={ref}
        className={`
          inline-flex
          items-center
          justify-center
          rounded-full
          font-medium
          transition-all
          duration-200
          
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-neutral-950
          focus-visible:ring-offset-2
          
          disabled:pointer-events-none
          disabled:opacity-50
          
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }