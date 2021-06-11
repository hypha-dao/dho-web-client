import OpenProposals from './open-proposals.vue'

export default {
  title: 'Profiles/Open Proposals',
  component: OpenProposals,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OpenProposals },
  template: `
    <open-proposals v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
