import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity'

const builder = imageUrlBuilder(client)

export function urlForImage(source: { asset: { _ref: string; _type: 'reference' }; hotspot?: { x: number; y: number; height: number; width: number } }) {
  return builder.image(source)
} 