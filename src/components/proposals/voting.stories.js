import Voting from './voting.vue'
import Vuex from 'vuex'
export default {
  title: 'Proposals/Voting',
  component: Voting,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Voting },
  template: `
    <voting v-bind="$props" />
  `,
  store: new Vuex.Store({
    modules: {
      accounts: {
        namespaced: true,
        state: {},
        getters: {
          isMember: (state) => {
            return true
          }
        }
      },
      dao: {
        namespaced: true,
        state: {},
        getters: {
          votingPercentages: (state) => {
            return {
              voting: 80,
              quorum: 20
            }
          }
        }
      }
    }
  })
})
// TODO: Props for each story are no good
export const Gest = Template.bind({})
Gest.args = {
  staging: false,
  submitting: false,
  fixed: false,
  proposal: {
    __typename: 'Payout',
    docId: '31378',
    creator: 'johnnyhypha1',
    createdDate: '2022-09-27T14:05:16Z',
    ballot_expiration_t: '2022-10-04T14:05:31Z',
    details_title_s: 'This is a test with a super duper looooong title!!',
    details_description_s: 'This is a test with a super duper looooong title!!',
    details_url_s: '',
    details_usdAmount_a: '1 USD',
    details_deferredPercX100_i: 100,
    details_pegAmount_a: '0.00 HUSD',
    details_rewardAmount_a: '2.00 HYPHA',
    details_voiceAmount_a: '2.00 HVOICE',
    details_state_s: 'proposed',
    details_ballotQuorum_i: null,
    details_ballotSupply_a: null,
    details_ballotAlignment_i: null,
    details_isCustom_i: 0,
    details_owner_n: null,
    cmntsect: [{ docId: '31379', comment: [], __typename: 'CmntSection' }],
    votetally: [{ pass_votePower_a: '1991415.41 HVOICE', fail_votePower_a: '0.00 HVOICE', abstain_votePower_a: '0.00 HVOICE', __typename: 'VoteTally' }],
    voteAggregate: { count: 1, __typename: 'VoteAggregateResult' },
    pass: { count: 1, __typename: 'VoteAggregateResult' },
    abstain: { count: 0, __typename: 'VoteAggregateResult' },
    fail: { count: 0, __typename: 'VoteAggregateResult' },
    vote: [{ vote_date_t: '2022-09-27T14:05:48Z', vote_voter_n: 'johnnyhypha1', vote_vote_s: 'pass', vote_votePower_a: '1991415.41 HVOICE', __typename: 'Vote' }]
  }
}

export const Base = Template.bind({})
Base.args = {
  ...Gest.args,
  activeButtons: true
}

export const BaseVotePass = Template.bind({})
BaseVotePass.args = {
  ...Gest.args,
  activeButtons: true,
  vote: 'pass'
}

export const BaseVoteAbstain = Template.bind({})
BaseVoteAbstain.args = {
  ...Gest.args,
  activeButtons: true,
  vote: 'abstain'
}

export const BaseVoteFail = Template.bind({})
BaseVoteFail.args = {
  ...Gest.args,
  activeButtons: true,
  vote: 'fail'
}

export const Approved = Template.bind({})
Approved.args = {
  ...Gest.args,
  activeButtons: true,
  status: 'approved',
  expiration: '8/May/2022'
}

export const Apply = Template.bind({})
Apply.args = {
  ...Gest.args,
  activeButtons: true,
  status: 'approved',
  unity: 0.50,
  quorum: 0.85,
  type: 'Badge',
  expiration: '8/May/2022'
}

export const Withdraw = Template.bind({})
Withdraw.args = {
  ...Gest.args,
  status: 'approved',
  active: true,
  type: 'Badge',
  expiration: '8/May/2022'
}

export const Suspended = Template.bind({})
Suspended.args = {
  ...Gest.args,
  activeButtons: true,
  status: 'suspended',
  expiration: '8/May/2022'
}

export const Archived = Template.bind({})
Archived.args = {
  ...Gest.args,
  status: 'rejected',
  expiration: '8/May/2022'
}

export const Withdrawed = Template.bind({})
Withdrawed.args = {
  ...Gest.args,
  status: 'withdrawed',
  expiration: '8/May/2022'
}
