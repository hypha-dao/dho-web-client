import VotingOptionYesNo from './voting-option-yes-no.vue'

export default {
  title: 'Contributions/Voting Option Yes, No',
  component: VotingOptionYesNo,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VotingOptionYesNo },
  template: `
    <voting-option-yes-no v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
