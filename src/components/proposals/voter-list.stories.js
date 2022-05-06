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
    <voter-list v-bind="$props"/>
  `
})

export const Example = Template.bind({})
Example.args = {
  votes: [
    {
      username: 'lukegravdent',
      vote: 'pass',
      percentage: '5%'
    },
    {
      username: 'johnnyhypha1',
      vote: 'pass',
      percentage: '5%'
    },
    {
      username: 'mem.hypha1',
      vote: 'fail',
      percentage: '5%'
    },
    {
      username: 'mem2.hypha',
      vote: 'pass',
      percentage: '5%'
    },
    {
      username: 'hyphanewyork',
      vote: 'abstain',
      percentage: '5%'
    }
  ],
  size: 5
}

export const Base = Template.bind({})
