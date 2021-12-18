
/**
 * This vuex data store contains the data and settings for the selected dao.
 */
export default {
  namespaced: true,
  state: {
    name: null,
    hash: null,
    settings: {}
  },

  getters: {},

  mutations: {
    // Called by DhoSelector.vue after the apollo query
    switchDao (state, dao) {
      if (dao && dao.length === 1) {
        state.name = dao[0].details_daoName_n
        state.hash = dao[0].hash
        state.settings = {
          name: dao[0].settings[0].settings_daoName_n,
          title: dao[0].settings[0].settings_daoTitle_s,
          description: dao[0].settings[0].settings_daoDescription_s,
          governanceContact: dao[0].settings[0].settings_governanceTokenContract_n,
          pegToken: dao[0].settings[0].settings_pegToken_a.split(' ')[1],
          pegContract: dao[0].settings[0].settings_pegTokenContract_n,
          rewardToken: dao[0].settings[0].settings_rewardToken_a.split(' ')[1],
          rewardContract: dao[0].settings[0].settings_rewardTokenContract_n,
          rewardToPegRatio: parseFloat(dao[0].settings[0].settings_rewardToPegRatio_a),
          treasuryContract: dao[0].settings[0].settings_treasuryContract_n,
          voiceToken: dao[0].settings[0].settings_voiceToken_a.split(' ')[1],
          votingDurationSeconds: dao[0].settings[0].settings_votingDurationSec_i,
          votingAlignmentPercent: dao[0].settings[0].settings_votingAlignmentX100_i,
          votingQuorumPercent: dao[0].settings[0].settings_votingQuorumX100_i
        }
      }
    }
  },

  actions: {}
}
