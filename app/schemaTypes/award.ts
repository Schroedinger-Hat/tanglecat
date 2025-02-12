import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Award badge or illustration',
      options: {
        hotspot: true, // Enables the hotspot UI for better image cropping
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isSupervised',
      title: 'Is Supervised',
      type: 'boolean',
      initialValue: false,
      description: 'If true, this award requires supervisor verification'
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'text',
      description: 'Instructions for completing the award'
    }),
    defineField({
      name: 'webhook',
      title: 'Webhook URL',
      type: 'url',
      description: 'URL to call after verification or redemption',
    }),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'eventCode',
      title: 'Event Code',
      type: 'reference',
      to: [{ type: 'eventCode' }],
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'abstract',
      points: 'points',
      event: 'eventCode.code',
      media: 'image'
    },
    prepare({ title, subtitle, points, event, media }) {
      return {
        title,
        subtitle: `${points} pts - ${subtitle}`,
        description: `Event: ${event}`,
        media
      }
    }
  }
}) 