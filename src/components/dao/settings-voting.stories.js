import SettingsVoting from './settings-voting.vue'

export default {
  title: 'Dao/Settings Voting',
  component: SettingsVoting,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SettingsVoting },
  template: `
    <settings-voting v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  form: {
    votingAlignmentPercent: 80,
    votingQuorumPercent: 20,
    votingDurationSec: 604800
  },

  isAdmin: true
}

export const Base = Template.bind({})
