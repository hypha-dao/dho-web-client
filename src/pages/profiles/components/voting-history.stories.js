import VotingHistory from './voting-history.vue'

export default {
  title: 'Profiles/Voting History',
  component: VotingHistory,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VotingHistory },
  template: `
    <voting-history v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  name: 'Johnny Hypha',
  more: false,
  votes: [
    {
      ballot_name: '0x1',
      ballot: {
        title: 'Blockchain Developer'
      },
      timestamp: '2021-04-27T00:04:11.000',
      vote: 'pass'
    },
    {
      ballot_name: '0x2',
      ballot: {
        title: 'Quest [1/1] New Profile Page'
      },
      timestamp: '2021-04-27T00:04:11.000',
      vote: 'pass'
    },
    {
      ballot_name: '0x1',
      ballot: {
        title: 'Quest [0/1] New Profile Page'
      },
      timestamp: '2021-04-27T00:04:11.000',
      vote: 'pass'
    }
  ]
}

export const Base = Template.bind({})
