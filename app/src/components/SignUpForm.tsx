'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { SignupPayload } from '@/types'
import { Button } from './ui/button'
import { Input } from './ui/input.generic'
import { getEventCodeFromSubdomain, isLocalhost } from '@/lib/utils/getEventCodeFromSubdomain'

export function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<SignupPayload>({
    firstName: '',
    lastName: '',
    email: '',
    eventCode: '',
    termsAccepted: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLocal, setIsLocal] = useState(false)
  const [detectedEventCode, setDetectedEventCode] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're on localhost
    const local = isLocalhost()
    setIsLocal(local)

    // Auto-detect event code from subdomain
    const eventCode = getEventCodeFromSubdomain()
    setDetectedEventCode(eventCode)

    if (eventCode) {
      setFormData(prev => ({ ...prev, eventCode }))
    }
  }, [])

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

    if (!formData.eventCode) {
      setError('Event code is required')
      setLoading(false)
      return
    }

    // Validate event code format (alphanumeric, no spaces)
    if (!/^[a-zA-Z0-9]+$/.test(formData.eventCode)) {
      setError('Event code must contain only letters and numbers (no spaces or special characters)')
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
      {/* Event Code Detection Info */}
      {!isLocal && detectedEventCode && (
        <div className="bg-green-50 text-green-700 p-3 rounded text-sm">
          <p className="font-medium">✅ Event Code Detected</p>
          <p>You&apos;re signing up for: <strong>{detectedEventCode}</strong></p>
        </div>
      )}

      {!isLocal && !detectedEventCode && (
        <div className="bg-orange-50 text-orange-700 p-3 rounded text-sm">
          <p className="font-medium">⚠️ Event Code Not Detected</p>
          <p>Unable to detect event code from subdomain. Please check your URL or enter the event code manually.</p>
          <p className="text-xs mt-1">
            Expected format: <code className="bg-orange-100 px-1 rounded">eventcode.tanglecat.dev</code> (e.g., <code className="bg-orange-100 px-1 rounded">osday25.tanglecat.dev</code>)
          </p>
        </div>
      )}

      {isLocal && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded text-sm">
          <p className="font-medium">🔧 Development Mode</p>
          <p>You&apos;re running locally. Enter an event code manually to test different scenarios.</p>
          <p className="text-xs mt-1">
            In production, this would be auto-detected from URLs like <code className="bg-yellow-100 px-1 rounded">osday25.tanglecat.dev</code>
          </p>
        </div>
      )}

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

      {/* Show event code input only on localhost, otherwise auto-detect from subdomain */}
      {isLocal ? (
        <div>
          <label className="block text-sm font-medium mb-1">Event Code</label>
          <Input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.eventCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, eventCode: e.target.value})}
            placeholder="Enter event code (e.g., osday25)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Development mode: Please enter the event code manually
          </p>
        </div>
      ) : detectedEventCode ? (
        <div>
          <label className="block text-sm font-medium mb-1">Event Code</label>
          <Input
            type="text"
            required
            className="w-full p-2 border rounded bg-gray-50"
            value={formData.eventCode}
            readOnly={true}
            title={`Automatically detected from subdomain: ${formData.eventCode}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Automatically detected from subdomain: <strong>{formData.eventCode}</strong>
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Event Code</label>
          <Input
            type="text"
            required
            className="w-full p-2 border rounded bg-red-50"
            value={formData.eventCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, eventCode: e.target.value})}
            placeholder="Unable to detect event code"
          />
          <p className="text-xs text-red-500 mt-1">
            Unable to detect event code from subdomain. Please enter it manually or check your URL.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Expected format: <code className="bg-gray-100 px-1 rounded">eventcode.tanglecat.dev</code> (e.g., <code className="bg-gray-100 px-1 rounded">osday25.tanglecat.dev</code>)
          </p>
        </div>
      )}

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