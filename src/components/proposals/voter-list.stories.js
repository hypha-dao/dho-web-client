import VoterList from './voter-list.vue'

export default {
  title: 'Proposals/Voter List',
  component: VoterList,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VoterList },
  template: `
    <voter-list v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  votes: [
    {
      date: 'Today',
      user: 'lukegravdent',
      vote: 'pass',
      strength: '10000 HVoice'
    },
    {
      date: 'Today',
      user: 'johnnyhypha1',
      vote: 'pass',
      strength: '23523.1 HVoice'
    },
    {
      date: 'Yesterday',
      user: 'mem.hypha1',
      vote: 'fail',
      strength: '234 HVoice'
    },
    {
      date: 'Yesterday',
      user: 'mem2.hypha',
      vote: 'pass',
      strength: '1 HVoice'
    },
    {
      date: '6 days ago',
      user: 'hyphanewyork',
      vote: 'abstain',
      strength: '12392382 HVoice'
    }
  ]
}

export const Base = Template.bind({})
