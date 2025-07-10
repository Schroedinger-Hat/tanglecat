'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SignupPayload } from '@/types'
import { Button } from './ui/button'
import { Input } from './ui/input.generic'

export function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<SignupPayload>({
    firstName: '',
    lastName: '',
    email: '',
    eventCode: 'osday25',
    termsAccepted: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    if (loading) return
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // Check if user is a supervisor and redirect accordingly
      if (data.role === 'supervisor' || data.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard?view=challenges')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <Input
          type="text"
          required
          className="w-full p-2 border rounded"
          value={formData.firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <Input
          type="text"
          required
          className="w-full p-2 border rounded"
          value={formData.lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          required
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 hidden">Event Code</label>
        <Input
          type="hidden"
          required
          className="w-full p-2 border rounded"
          readOnly
          value={formData.eventCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, eventCode: e.target.value})}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          required
          id="terms"
          className="mr-2"
          checked={formData.termsAccepted}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, termsAccepted: e.target.checked})}
        />
        <label htmlFor="terms" className="text-sm">
          I accept the{' '}
          <a href="https://osday.dev/page/privacy" target="_blank" className="text-blue-600 hover:underline">
            terms and conditions
          </a>
        </label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        variant="accent"
        className="w-full"
      >
        {loading ? 'Signing up...' : 'Join Challenge'}
      </Button>
    </form>
  )
}