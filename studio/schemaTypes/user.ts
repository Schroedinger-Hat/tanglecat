import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Player', value: 'player' },
          { title: 'Supervisor', value: 'supervisor' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'completedChallenges',
      title: 'Completed Challenges',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'challenge'}]}],
      hidden: ({document}) => document?.role !== 'player',
    }),
    defineField({
      name: 'assignedChallenges',
      title: 'Assigned Challenges',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'challenge'}]}],
      hidden: ({document}) => document?.role !== 'supervisor',
    }),
    defineField({
        name: 'eventCodes',
        title: 'Event Codes',
        type: 'array',
        of: [{type: 'reference', to: [{type: 'eventCode'}]}],
    }),
  ],
}) 