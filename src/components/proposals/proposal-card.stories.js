import ProposalCard from './proposal-card.vue'
import Vuex from 'vuex'

export default {
  title: 'Proposals/Card',
  component: ProposalCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalCard },
  template: `
    <proposal-card v-bind="$props" />
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
  proposal: {
    docId: '31378',
    ballot_expiration_t: '2022-10-04T14:05:31Z',
    creator: 'johnnyhypha1',
    createdDate: '2022-09-27T14:05:16Z',
    details_title_s: 'This is a test with a super duper looooong title!!',
    details_description_s: 'This is a test with a super duper looooong title!!',
    details_pegAmount_a: '0.00 HUSD',
    details_rewardAmount_a: '2.00 HYPHA',
    details_voiceAmount_a: '2.00 HVOICE',
    details_ballotQuorum_i: null,
    details_ballotSupply_a: null,
    details_ballotAlignment_i: null,
    details_owner_n: null,
    cmntsect: [
      {
        docId: '31379',
        comment: [

        ]
      }
    ],
    pass: {
      count: 1
    },
    abstain: {
      count: 0
    },
    fail: {
      count: 0
    },
    votetally: [
      {
        pass_votePower_a: '1991415.41 HVOICE',
        fail_votePower_a: '0.00 HVOICE',
        abstain_votePower_a: '0.00 HVOICE'
      }
    ],
    vote: [
      {
        vote_date_t: '2022-09-27T14:05:48Z',
        vote_voter_n: 'johnnyhypha1',
        vote_vote_s: 'pass',
        vote_votePower_a: '1991415.41 HVOICE'
      }
    ]
  }

}

export const Base = Template.bind({})
Base.args = {
  ...Example.args
}
