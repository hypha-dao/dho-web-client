import NewMembers from './new-members.vue'

export default {
  title: 'dashboard/New Members',
  component: NewMembers,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NewMembers },
  template: `
    <new-members v-bind="$props"/>
  `
})

export const Example = Template.bind({})
Example.args = {
  members: [
    {
      avatar: 'https://cdn.quasar.dev/img/avatar.png',
      name: 'Khem Poudel',
      joinedDate: '10/2/21 15:23:53',
      profileLink: ''
    },
    {
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      name: 'Miguel Ulrich',
      joinedDate: '10/1/21 10:18:20',
      profileLink: ''
    },
    {
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
      name: 'Lineke',
      joinedDate: '9/25/21 06:54:05',
      profileLink: ''
    },
    {
      avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
      name: 'Christina Trout',
      joinedDate: '9/19/21 20:15:32',
      profileLink: ''
    },
    {
      avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
      name: 'Michael',
      joinedDate: '9/10/21 15:50:09',
      profileLink: ''
    }
  ]
}

export const Base = Template.bind({})
