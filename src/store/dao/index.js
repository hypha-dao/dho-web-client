
/**
 * This vuex data store contains the data and settings for the selected dao.
 */
export default {
  namespaced: true,
  state: {
    name: null,
    docId: null,
    settings: {},
    dho: null
  },

  getters: {
    selectedDao (state) {
      return {
        name: state.name,
        docId: state.docId,
        description: state.settings ? state.settings.description : undefined
      }
    },
    daoSettings (state) {
      return state.settings
    },
    dho (state) {
      return state.dho
    },
    getDaoTokens (state) {
      return {
        pegToken: state.settings.pegToken,
        pegTokenDecimals: state.settings.pegTokenDecimals,
        rewardToken: state.settings.rewardToken,
        rewardTokenDecimals: state.settings.rewardTokenDecimals,
        voiceToken: state.settings.voiceToken,
        voiceTokenDecimals: state.settings.voiceTokenDecimals
      }
    }
  },

  mutations: {
    setDho (state, dho) {
      if (dho && dho.length === 1) {
        state.dho = dho[0]
      }
    },
    // Called by DhoSelector.vue after the apollo query
    switchDao (state, dao) {
      if (dao && dao.length === 1) {
        state.name = dao[0].details_daoName_n
        state.hash = dao[0].hash
        state.docId = dao[0].docId
        state.settings = {
          name: dao[0].settings[0].settings_daoName_n,
          title: dao[0].settings[0].settings_daoTitle_s,
          description: dao[0].settings[0].settings_daoDescription_s,
          governanceContact: dao[0].settings[0].settings_governanceTokenContract_n,
          pegToken: dao[0].settings[0].settings_pegToken_a.split(' ')[1],
          pegTokenDecimals: dao[0].settings[0].settings_pegToken_a.split(' ')[0].split('.')[1].length,
          pegContract: dao[0].settings[0].settings_pegTokenContract_n,
          rewardToken: dao[0].settings[0].settings_rewardToken_a.split(' ')[1],
          rewardTokenDecimals: dao[0].settings[0].settings_rewardToken_a.split(' ')[0].split('.')[1].length,
          rewardContract: dao[0].settings[0].settings_rewardTokenContract_n,
          rewardToPegRatio: parseFloat(dao[0].settings[0].settings_rewardToPegRatio_a),
          treasuryContract: dao[0].settings[0].settings_treasuryContract_n,
          voiceToken: dao[0].settings[0].settings_voiceToken_a.split(' ')[1],
          voiceTokenDecimals: dao[0].settings[0].settings_voiceToken_a.split(' ')[0].split('.')[1].length,
          votingDurationSeconds: dao[0].settings[0].settings_votingDurationSec_i,
          votingAlignmentPercent: dao[0].settings[0].settings_votingAlignmentX100_i,
          votingQuorumPercent: dao[0].settings[0].settings_votingQuorumX100_i,
          usesSeeds: Boolean(dao[0].settings[0].settings_usesSeeds_i),
          isHypha: Boolean(dao[0].settings[0].settings_isHypha_i),
          periodDurationSec: dao[0].settings[0].settings_periodDurationSec_i
        }
      }
    }
  },

  actions: {}
}
