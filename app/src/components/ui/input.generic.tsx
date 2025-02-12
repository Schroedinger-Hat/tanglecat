import * as React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={`
            w-full
            px-4
            py-3
            bg-white
            border-2
            border-neutral-950
            shadow-[4px_4px_0px_0px_rgba(23,23,23)]
            hover:shadow-[2px_2px_0px_0px_rgba(23,23,23)]
            hover:translate-x-[2px]
            hover:translate-y-[2px]
            active:shadow-none
            active:translate-x-[4px]
            active:translate-y-[4px]
            rounded-lg
            text-base
            placeholder:text-neutral-400
            
            transition-all
            duration-200
            
            focus:outline-none
            focus:ring-1
            
            disabled:opacity-50
            disabled:cursor-not-allowed
            
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="absolute -bottom-5 left-0 text-xs text-red-500">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input } 