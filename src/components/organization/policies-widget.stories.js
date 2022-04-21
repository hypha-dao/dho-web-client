import PoliciesWidget from './policies-widget.vue'

export default {
  title: 'organization/Policies Widget',
  component: PoliciesWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PoliciesWidget },
  template: `
    <policies-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  policies: [
    {
      title: 'Policy Title',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
    },
    {
      title: 'Policy Title',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
    },
    {
      title: 'Policy Title',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
    }
  ]
}

export const Base = Template.bind({})
