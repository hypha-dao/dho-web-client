import ProposalBanner from './proposal-banner.vue'

export default {
  title: 'Proposals/Banner',
  component: ProposalBanner,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalBanner },
  template: `
    <proposal-banner v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
