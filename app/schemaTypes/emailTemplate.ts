import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'emailTemplate',
  title: 'Email Template',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Template Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subject',
      title: 'Email Subject',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Email Body',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'triggerEvent',
      title: 'Trigger Event',
      type: 'string',
      options: {
        list: [
          {title: 'Challenge Completed', value: 'challengeCompleted'},
          {title: 'New Challenge Available', value: 'newChallenge'},
          {title: 'Points Updated', value: 'pointsUpdated'},
        ],
      },
    }),
  ],
}) 