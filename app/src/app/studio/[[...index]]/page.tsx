'use client'

import { NextStudio } from 'next-sanity/studio'
import  config  from '../../../../sanity-next.config'
export default function StudioPage() {
  console.log('env', process.env.NODE_ENV); 
  return <NextStudio config={config} />
} 