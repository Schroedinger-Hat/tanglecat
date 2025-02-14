import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'challenge',
  title: 'Challenge',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'playersLimit',
      title: 'Players Limit',
      type: 'number',
      validation: Rule => Rule.min(0)
    }),
    defineField({
      name: 'pointsRequirement',
      title: 'Points Required to Unlock',
      type: 'number',
      validation: Rule => Rule.min(0)
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: Rule => Rule.required().min(Rule.valueOfField('startDate'))
    }),
    defineField({
      name: 'isSupervised',
      title: 'Is Supervised',
      type: 'boolean',
      initialValue: false,
      description: 'If true, the challenge need to be supervised by a staff member'
    }),
    defineField({
      name: 'isOnline',
      title: 'Is Online Challenge',
      type: 'boolean',
      initialValue: false,
      description: 'If true, the challenge will be online and no supervisor need to do any action to validate the challenge'
    }),
    defineField({
      name: 'verificationConfigJSON',
      title: 'Verification Config JSON',
      type: 'object',
      fields: [
        {
          name: 'type',
          type: 'string',
          options: {
            list: [
              { title: 'Trust', value: 'trust' },
              { title: 'Verification', value: 'verification' },
            ],
          },
        },
        {
          name: 'fields',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'type',
                type: 'string',
                options: {
                  list: [
                    { title: 'Text', value: 'text' },
                    { title: 'Hidden Text', value: 'hidden' },
                  ],
                },
              },
              {
                name: 'title',
                type: 'string',
              },
              {
                name: 'value',
                type: 'string',
                description: 'The pre-filled value for the field'
              },
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'description',
                type: 'string'
              }
            ]
          }]
        }
      ],
      description: 'JSON config data to verify the challenge completion',
      initialValue: () => ({
        type: 'trust',
        fields: [
          {
            type: 'text',
            title: 'Social Media Post URL',
            name: 'socialUrl',
            description: 'URL to the social media post to verify the challenge completion'
          }
        ]
      }),
    }),
    defineField({
      name: 'webhookUrl',
      title: 'Webhook URL',
      type: 'url',
      description: 'URL to call after verification or redemption',
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
      points: 'points',
      startDate: 'startDate',
      eventCode: 'eventCode.code'
    },
    prepare({ title, points, startDate, eventCode }) {
      return {
        title,
        subtitle: `${points} points - Event: ${eventCode} - Starts: ${new Date(startDate).toLocaleDateString()}`
      }
    }
  }
}) 