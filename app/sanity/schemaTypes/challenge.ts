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
      validation: Rule => Rule.required(),
      description: 'The abstract of the challenge, displayed in the leaderboard'
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
      description: 'The instructions for the challenge, displayed in the challenge detail page. If not provided, we will use the default instructions.'
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
      description: '(not enabled) The maximum number of players that can complete the challenge',
      type: 'number',
      validation: Rule => Rule.min(0)
    }),
    defineField({
      name: 'pointsRequirement',
      title: 'Points Required to Unlock',
      type: 'number',
      description: '(not enabled) The minimum number of points a player need to have to unlock the challenge',
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
      description: 'If true, the challenge will be validated via a webhook / integration e.g. github stars, google form'
    }),
    defineField({
        name: 'callToAction',
        title: 'Call to Action',
        type: 'object',
        fields: [
            {
                name: 'text',
                title: 'Button Text',
                type: 'string',
            },
            {
                name: 'url',
                title: 'URL to redirect to',
                type: 'url',
            }
        ],
        description: 'The text and url to display as a call to action for the challenge'
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