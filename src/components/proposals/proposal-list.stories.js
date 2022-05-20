import ProposalList from './proposal-list.vue'
import Vuex from 'vuex'

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
  `,
  store: new Vuex.Store({
    modules: {
      dao: {
        namespaced: true,
        state: {},
        getters: {
          daoSettings: (state) => {
            return {
              rewardToPegRatio: 0.5
            }
          },
          votingPercentages: (state) => {
            return {
              quorum: 50,
              unity: 50
            }
          }
        }
      }
    }
  })
})

export const Example = Template.bind({})
Example.args = {
  proposals: [],
  username: 'johnnyhypha1',
  supply: 1000,
  view: 'list'
}

export const Base = Template.bind({})
Base.args = {
  ...Example.args
}

export const WithProposals = Template.bind({})
WithProposals.args = {
  ...Base.args,
  proposals: [
    {
      docId: 30480,
      __typename: 'Payout',
      details_pegAmount_a: '1850.00 HUSD',
      details_rewardAmount_a: '6300.00 HYPHA',
      details_voiceAmount_a: '10000.00 HVOICE',
      details_description_s: 'wewew',
      details_title_s: 'ewqweqwewq',
      ballot_expiration_t: '2022-05-23T22:22:50Z',
      creator: 'johnnyhypha1',
      createdDate: '2022-05-16T22:22:50Z',
      details_ballotQuorum_i: null,
      details_ballotSupply_a: null,
      details_ballotAlignment_i: null,
      pass: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      abstain: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      fail: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      votetally: [
        {
          pass_votePower_a: '0.00 HVOICE',
          fail_votePower_a: '0.00 HVOICE',
          abstain_votePower_a: '0.00 HVOICE',
          __typename: 'VoteTally'
        }
      ],
      vote: []
    },
    {
      docId: '30482',
      __typename: 'Assignment',
      creator: 'johnnyhypha1',
      claimed: [],
      ballot_expiration_t: '2022-05-23T22:25:33Z',
      details_title_s: 'Asign test',
      details_description_s: '',
      details_assignee_n: 'johnnyhypha1',
      details_periodCount_i: 3,
      start: [
        {
          details_startTime_t: '2022-05-22T18:43:00Z',
          __typename: 'Period'
        }
      ],
      details_pegSalaryPerPeriod_a: '0.00 HUSD',
      details_rewardSalaryPerPeriod_a: '7282.68 HYPHA',
      details_voiceSalaryPerPeriod_a: '7282.68 HVOICE',
      details_timeShareX100_i: 100,
      lastimeshare: [],
      details_deferredPercX100_i: 100,
      details_state_s: 'proposed',
      role: [
        {
          details_title_s: 'SWEET Team Member',
          details_annualUsdSalary_a: '190000.00 USD',
          details_minDeferredX100_i: 98,
          __typename: 'Role'
        }
      ],
      details_ballotQuorum_i: null,
      details_ballotSupply_a: null,
      details_ballotAlignment_i: null,
      pass: {
        count: 1,
        __typename: 'VoteAggregateResult'
      },
      abstain: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      fail: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      votetally: [
        {
          pass_votePower_a: '2377000.99 HVOICE',
          fail_votePower_a: '0.00 HVOICE',
          abstain_votePower_a: '0.00 HVOICE',
          __typename: 'VoteTally'
        }
      ],
      vote: []
    },
    {
      docId: '30473',
      __typename: 'Assignbadge',
      details_title_s: 'test badge ',
      details_description_s: 'test badge',
      details_state_s: 'proposed',
      details_badge_i: 6162,
      creator: 'johnnyhypha1',
      createdDate: '2022-05-16T19:46:50.5Z',
      ballot_expiration_t: '2022-05-23T19:46:50Z',
      start: [],
      details_ballotQuorum_i: null,
      details_ballotSupply_a: null,
      details_ballotAlignment_i: null,
      pass: {
        count: 1,
        __typename: 'VoteAggregateResult'
      },
      abstain: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      fail: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      votetally: [
        {
          pass_votePower_a: '2377000.99 HVOICE',
          fail_votePower_a: '0.00 HVOICE',
          abstain_votePower_a: '0.00 HVOICE',
          __typename: 'VoteTally'
        }
      ],
      vote: []
    },
    {
      docId: '30486',
      __typename: 'Badge',
      details_description_s: 'ddd',
      details_title_s: 'ddd',
      ballot_expiration_t: '2022-05-24T10:50:33Z',
      creator: 'johnnyhypha1',
      createdDate: '2022-05-17T10:50:33.5Z',
      details_ballotQuorum_i: null,
      details_ballotSupply_a: null,
      details_ballotAlignment_i: null,
      pass: {
        count: 1,
        __typename: 'VoteAggregateResult'
      },
      abstain: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      fail: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      votetally: [
        {
          pass_votePower_a: '2377000.99 HVOICE',
          fail_votePower_a: '0.00 HVOICE',
          abstain_votePower_a: '0.00 HVOICE',
          __typename: 'VoteTally'
        }
      ],
      vote: []
    },
    {
      docId: '30232',
      __typename: 'Suspend',
      details_description_s: '',
      details_title_s: 'Suspension of assignment: Catalyzing and Connecting B4',
      ballot_expiration_t: '2022-04-22T15:41:42Z',
      details_state_s: 'proposed',
      creator: 'johnnyhypha1',
      createdDate: '2022-04-15T15:41:42Z',
      details_ballotQuorum_i: null,
      details_ballotSupply_a: null,
      details_ballotAlignment_i: null,
      pass: {
        count: 1,
        __typename: 'VoteAggregateResult'
      },
      abstain: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      fail: {
        count: 0,
        __typename: 'VoteAggregateResult'
      },
      votetally: [
        {
          pass_votePower_a: '2400001.00 HVOICE',
          fail_votePower_a: '0.00 HVOICE',
          abstain_votePower_a: '0.00 HVOICE',
          __typename: 'VoteTally'
        }
      ],
      vote: []
    }
  ]
}
