import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'eventCode',
  title: 'Event Code',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'datetime',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'code',
      subtitle: 'description',
    },
  },
}) 