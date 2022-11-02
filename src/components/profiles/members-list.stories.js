import MemberList from './members-list.vue'

export default {
  title: 'Profiles/Members List',
  component: MemberList,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MemberList },
  template: `
    <members-list v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
