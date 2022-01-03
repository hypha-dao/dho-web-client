import ProposalList from './proposal-list.vue'

export default {
  title: 'Proposals/List',
  component: ProposalList,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalList },
  template: `
    <proposal-list v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  proposals: [
    {
      __typename: 'Assignment',
      details_title_s: 'Hypha Frontend Dev',
      role: [
        {
          details_title_s: 'Building and Developing B4'
        }
      ],
      votetally: [
        {
          abstain_votePower_a: 200,
          pass_votePower_a: 300,
          fail_votePower_a: 100
        }
      ],
      vote: [
        {
          vote_voter_n: 'johnnyhypha1',
          vote_vote_s: 'fail'
        }
      ]
    },
    {
      __typename: 'Payout',
      details_title_s: 'Bridge Contribution - May 15 to June 20',
      votetally: [
        {
          abstain_votePower_a: 100,
          pass_votePower_a: 100,
          fail_votePower_a: 100
        }
      ],
      vote: [
        {
          vote_voter_n: 'johnnyhypha1',
          vote_vote_s: 'pass'
        }
      ]
    },
    {
      __typename: 'Payout',
      details_title_s: 'Expense Reimbursement: AWS Fees',
      votetally: [
        {
          abstain_votePower_a: 100,
          pass_votePower_a: 800,
          fail_votePower_a: 0
        }
      ],
      vote: [
        {
          vote_voter_n: 'johnnyhypha1',
          vote_vote_s: 'abstain'
        }
      ]
    }
  ],
  username: 'johnnyhypha1',
  supply: 1000,
  view: 'list'
}

export const Base = Template.bind({})
