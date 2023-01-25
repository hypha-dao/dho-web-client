import UpvoteDelegateWidget from './upvote-delegate-widget.vue'

export default {
  title: 'Common/ Upvote Deletage Widget',
  component: UpvoteDelegateWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { UpvoteDelegateWidget },
  template: `
    <upvote-delegate-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {
  endDate: '2023-09-01',
  users: [
    {
      headDelegate: true,
      name: 'User'
    },
    {
      name: 'User'
    },
    {
      name: 'User'
    },
    {
      name: 'User'
    }
  ]
}

export const Base = Template.bind({})
