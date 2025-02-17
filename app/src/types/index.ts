export interface User {
  _id: string
  _type: 'user'
  name: string
  email: string
  totalPoints: number
  completedChallenges: string[]
  createdAt: string
  eventCode: {
    _type: 'reference'
    _ref: string
  }
  eventId?: string
}

export interface EventCode {
  _id: string
  _type: 'eventCode'
  code: string
  description?: string
  validUntil?: string
  isActive: boolean
}

export interface SignupPayload {
  firstName: string
  lastName: string
  email: string
  eventCode: string
  termsAccepted: boolean
}

export interface Challenge {
  _id: string
  _type: 'challenge'
  name: string
  abstract: string
  description: string
  points: number
  isSupervised: boolean
  instructions: string
  isOnline: boolean
  startDate: string
  endDate: string
  playersLimit?: number
  pointsRequirement?: number
  webhookUrl?: string
  callToAction?: {
    text: string
    url: string
  }
  verificationConfigJSON?: {
    type: string
    fields: {
      type: string
      title: string
      name: string
      description: string
      value?: string
    }[]
  }
  event: {
    _type: 'reference'
    _ref: string
  }
}

export interface Award {
  _id: string
  _type: 'award'
  name: string
  abstract: string
  description: string
  isSupervised: boolean
  instructions?: string
  webhook?: string
  points: number
  image: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }
  eventCode: {
    _ref: string
    _type: 'reference'
  }
} 