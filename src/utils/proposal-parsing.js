import { date } from 'quasar'
import { dateToString } from './TimeUtils'
import { PROPOSAL_TYPE, PROPOSAL_STATE } from '../const'
export const PERIOD_NAMES = ['First Quarter', 'Full Moon', 'New Moon', 'Last Quarter']
export const coefficientBase = 10000
export const cycleDurationSec = 2629800

export function created (proposal) {
  return new Date(proposal.createdDate)
}
export function restrictions (proposal) {
  return proposal.details_maxCycles_i || proposal.details_maxPeriodCount_i || '0'
}
export function purpose (proposal) {
  return proposal?.details_purpose_s
}
export function url (proposal) {
  return proposal.details_url_s
}
export function docId (proposal) {
  return proposal?.docId
}
export function expiration (proposal) {
  return proposal?.ballot_expiration_t
}
export function pastQuorum (proposal) {
  return proposal?.details_ballotQuorum_i
}
export function pastUnity (proposal) {
  return proposal?.details_ballotAlignment_i
}
export function quorum (proposal, supply) {
  return voting(proposal, supply).quorum
}
export function unity (proposal, supply) {
  return voting(proposal, supply).unity
}
export function createdDate (proposal) {
  return proposal?.createdDate
}
export function state (proposal) {
  return proposal?.details_state_s
}
export function votingMethod (proposal) {
  return proposal?.details_votingMethod_s
}
export function parentCircle (proposal) {
  return proposal?.parentcircle ? proposal?.parentcircle : proposal?.circle
}
export function icon (proposal) {
  if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) proposal = proposal.suspend[0]
  if (proposal.__typename === PROPOSAL_TYPE.ABILITY) return proposal.badge[0].details_icon_s
  if (proposal.__typename === PROPOSAL_TYPE.EDIT) return proposal.original[0].badge?.[0]?.details_icon_s
  return proposal.details_icon_s
}
export function votingTimeLeft (proposal) {
  const date = proposal.ballot_expiration_t ? proposal.ballot_expiration_t : proposal.createdDate
  const end = new Date(`${date}`).getTime(proposal)
  const now = Date.now(proposal)
  const t = end - now
  return t
}
export function timeLeftString (proposal, long = false) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const MS_PER_HOUR = 1000 * 60 * 60
  const MS_PER_MIN = 1000 * 60
  const MS = 1000
  const timeRemaining = votingTimeLeft(proposal)
  if (timeRemaining > 0) {
    const days = Math.floor(timeRemaining / MS_PER_DAY)
    let lesstime = timeRemaining - (days * MS_PER_DAY)
    const hours = Math.floor(lesstime / MS_PER_HOUR)
    lesstime = lesstime - (hours * MS_PER_HOUR)
    const min = Math.floor(lesstime / MS_PER_MIN)
    lesstime = lesstime - (min * MS_PER_MIN)
    const seg = Math.floor(lesstime / MS)

    let dayStr = ''
    if (days > 0) {
      dayStr = days === 1 ? `${days} day, ` : `${days} days, `
    }
    const hourStr = hours > 9 ? hours : `0${hours}`
    const minStr = min > 9 ? min : `0${min}`
    const segStr = seg > 9 ? seg : `0${seg}`
    if (long) {
      return `This vote will close in ${dayStr}${hourStr}:${minStr}:${segStr}`
    } else {
      return `${dayStr}${hourStr}:${minStr}:${segStr}`
    }
  }
  if (long) {
    const end = proposal.ballot_expiration_t ? new Date(expiration(proposal)) : new Date(createdDate(proposal))
    const format = date.formatDate(end, 'MMM D,YYYY')
    return `On ${format}`
  } else if (state(proposal) === PROPOSAL_STATE.DRAFTED) {
    const now = new Date()
    const end = proposal.ballot_expiration_t ? new Date(expiration(proposal)) : new Date(createdDate(proposal))
    let diff = date.getDateDiff(now, end, 'days')
    if (diff === 0) {
      diff = date.getDateDiff(now, end, 'hours')
      if (diff === 0) {
        diff = date.getDateDiff(now, end, 'minutes')
        if (diff === 0) {
          diff = date.getDateDiff(now, end, 'seconds')
          diff += diff === 1 ? ' second' : ' seconds'
        } else {
          diff += diff === 1 ? ' minute' : ' minutes'
        }
      } else {
        diff += diff === 1 ? ' hour' : ' hours'
      }
    } else {
      diff += diff === 1 ? ' day' : ' days'
    }
    return `Created ${diff} ago`
  } else {
    const now = new Date()
    const end = proposal.ballot_expiration_t ? new Date(expiration(proposal)) : new Date(createdDate(proposal))
    let diff = date.getDateDiff(now, end, 'days')
    if (diff === 0) {
      diff = date.getDateDiff(now, end, 'hours')
      diff += diff === 1 ? ' hour' : ' hours'
    } else {
      diff += diff === 1 ? ' day' : ' days'
    }
    return `Closed ${diff} ago`
  }
}

export function isVotingExpired (proposal) {
  return votingTimeLeft(proposal) < 0
}
export function isAccepted (proposal, votingPercentages, supply) {
  let q
  let u

  if (pastQuorum(proposal) && pastUnity(proposal)) {
    q = pastQuorum(proposal) / 100
    u = pastUnity(proposal) / 100
  } else {
    q = votingPercentages.quorum / 100
    u = votingPercentages.unity / 100
  }

  return (quorum(proposal, supply) >= q && unity(proposal, supply) >= u) || status(proposal) === PROPOSAL_STATE.APPROVED
}
export function isProposed (proposal) {
  return status(proposal) === PROPOSAL_STATE.PROPOSED
}
export function canBeSuspended (proposal, votingPercentages) {
  return (isAccepted(proposal, votingPercentages) || isRejected(proposal)) && [PROPOSAL_TYPE.ABILITY, PROPOSAL_TYPE.ROLE, PROPOSAL_TYPE.ARCHETYPE, PROPOSAL_TYPE.BADGE].includes(type(proposal))
}
export function canBeApply (proposal) {
  return status(proposal) === PROPOSAL_STATE.APPROVED && [PROPOSAL_TYPE.BADGE, PROPOSAL_TYPE.ARCHETYPE].includes(type(proposal))
}
export function isSuspended (proposal) {
  return status(proposal) === PROPOSAL_STATE.SUSPENDED
}
export function isArchived (proposal) {
  return status(proposal) === PROPOSAL_STATE.ARCHIVED
}
export function canBeWithdraw (proposal, username) {
  return [PROPOSAL_TYPE.ABILITY, PROPOSAL_TYPE.ROLE, PROPOSAL_TYPE.ARCHETYPE, PROPOSAL_TYPE.BADGE].includes(type(proposal)) && (creator(proposal) === username) && (isApproved(proposal))
}
export function isApproved (proposal) {
  return status(proposal) === PROPOSAL_STATE.APPROVED
}
export function isWithdrawed (proposal) {
  return status(proposal) === PROPOSAL_STATE.WITHDRAWED
}
export function isRejected (proposal) {
  return status(proposal) === PROPOSAL_STATE.REJECTED
}
export function type (proposal) {
  return proposal.__typename
}
export function suspendType (proposal) {
  return proposal.suspend[0]?.__typename
}
export function title (proposal) {
  if (proposal) {
    if (proposal.__typename === PROPOSAL_TYPE.EDIT) {
      return proposal.original[0].details_title_s
    }
    return proposal.details_title_s
  }
  return null
}
export function subtitle (proposal) {
  if (proposal) {
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND && proposal.suspend) proposal = proposal.suspend[0]
    if (proposal.__typename === PROPOSAL_TYPE.ROLE) {
      return proposal.role[0].details_title_s
    } if (proposal.__typename === PROPOSAL_TYPE.ABILITY) {
      return proposal.badge[0].details_title_s
    } else if (proposal.__typename === PROPOSAL_TYPE.EDIT) {
      if (proposal.original && proposal.original[0].role) {
        return proposal.original[0].role[0].details_title_s
      }
      if (proposal.original && proposal.original[0].badge) {
        return proposal.original[0].badge[0].details_title_s
      }
    } else {
      return null
    }
  }
  return null
}
export function description (proposal) {
  if (proposal) {
    if (proposal.__typename === PROPOSAL_TYPE.EDIT) {
      return proposal.details_ballotDescription_s
    }
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) {
      return proposal.suspend[0].details_description_s
    }
    return proposal.details_description_s
  }
  return null
}

export function periodCount (proposal) {
  if (proposal) {
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) proposal = proposal.suspend[0]
    if (proposal.__typename === PROPOSAL_TYPE.ROLE || proposal.__typename === PROPOSAL_TYPE.EDIT) {
      return proposal.details_periodCount_i
    }
    if (proposal.__typename === PROPOSAL_TYPE.ABILITY) {
      return proposal.details_periodCount_i
    }
  }
  return null
}
export function status (proposal) {
  return proposal?.details_state_s
}
export function creator (proposal) {
  if (proposal.__typename === PROPOSAL_TYPE.ABILITY || proposal.__typename === PROPOSAL_TYPE.ROLE) return proposal.details_assignee_n ?? proposal.creator
  if (proposal.__typename === PROPOSAL_TYPE.PAYOUT || proposal.__typename === PROPOSAL_TYPE.ARCHETYPE) return proposal.details_owner_n ?? proposal.creator
  if (proposal.__typename === PROPOSAL_TYPE.BADGE && proposal.system_proposer_n) return proposal.system_proposer_n
  return proposal.creator
}
export function colorConfig (proposal, votingPercentages, supply, isCard) {
  const config = {
    progress: '',
    icons: '',
    text: {}
  }

  if (isCard) {
    if ((unity(proposal, supply) >= votingPercentages.unity / 100)) {
      config.progress = config.icons = 'positive'
      config.text['text-positive'] = true
      return config
    }

    if ((unity(proposal, supply) < votingPercentages.unity / 100 && unity(proposal, supply) > 0)) {
      config.progress = config.icons = 'negative'
      config.text['text-negative'] = true
      return config
    }
  } else {
    if (isVotingExpired(proposal) || isApproved(proposal)) {
      config.progress = config.icons = 'white'
      config.text['text-white'] = true
      return config
    }

    if (pastUnity(proposal)) {
      if (unity(proposal, supply) >= pastUnity(proposal) / 100) {
        config.progress = config.icons = 'positive'
        config.text['text-positive'] = true
        return config
      }
      return undefined
    }

    if ((unity(proposal, supply) >= votingPercentages.unity / 100)) {
      config.progress = config.icons = 'positive'
      config.text['text-positive'] = true
      return config
    }

    if ((unity(proposal, supply) < votingPercentages.unity / 100 && unity(proposal, supply) > 0)) {
      config.progress = config.icons = 'negative'
      config.text['text-negative'] = true
      return config
    }
  }

  return undefined
}
export function colorConfigQuorum (proposal, votingPercentages, supply, isCard) {
  const config = {
    progress: '',
    icons: '',
    text: {}
  }
  if (isCard) {
    if ((quorum(proposal, supply) >= votingPercentages.quorum / 100)) {
      config.progress = config.icons = 'positive'
      config.text['text-positive'] = true
      return config
    }

    if ((quorum(proposal, supply) < votingPercentages.quorum / 100) && quorum(proposal, supply) > 0) {
      config.progress = config.icons = 'negative'
      config.text['text-negative'] = true
      return config
    }
  } else {
    if (isVotingExpired(proposal) || isApproved(proposal)) {
      config.progress = config.icons = 'white'
      config.text['text-white'] = true
      return config
    }

    if (pastQuorum(proposal)) {
      if (quorum(proposal, supply) >= pastQuorum(proposal) / 100) {
        config.progress = config.icons = 'positive'
        config.text['text-positive'] = true
        return config
      }
      return undefined
    }

    if ((quorum(proposal, supply) >= votingPercentages.quorum / 100)) {
      config.progress = config.icons = 'positive'
      config.text['text-positive'] = true
      return config
    }

    if ((quorum(proposal, supply) < votingPercentages.quorum / 100) && quorum(proposal, supply) > 0) {
      config.progress = config.icons = 'negative'
      config.text['text-negative'] = true
      return config
    }
  }

  return undefined
}
export function voteConfig (proposal, username) {
  if (proposal.vote && proposal.vote.length) {
    const vote = proposal.vote.find(v => v.vote_voter_n === username)
    if (vote) {
      if (vote.vote_vote_s === 'pass') {
        return {
          color: 'positive',
          icon: 'far fa-thumbs-up',
          vote: 'pass'
        }
      } else if (vote.vote_vote_s === 'fail') {
        return {
          color: 'negative',
          icon: 'far fa-thumbs-down',
          vote: 'fail'
        }
      } else if (vote.vote_vote_s === 'abstain') {
        return {
          color: 'body',
          icon: 'fas fa-ban',
          vote: 'abstain'
        }
      }
    }
  }
  return null
}
export function voting (proposal, supply) {
  if (proposal && proposal.votetally && proposal.votetally.length) {
    const abstain = parseFloat(proposal.votetally[0].abstain_votePower_a)
    const pass = parseFloat(proposal.votetally[0].pass_votePower_a)
    const fail = parseFloat(proposal.votetally[0].fail_votePower_a)

    const unity = (pass + fail > 0) ? pass / (pass + fail) : 0
    if (proposal.details_ballotSupply_a) {
      const [amount] = proposal.details_ballotSupply_a.split(' ')
      supply = parseFloat(amount)
    }
    const quorum = supply > 0 ? (abstain + pass + fail) / supply : 0
    return {
      unity,
      quorum,
      pastQuorum: proposal?.details_ballotQuorum_i,
      pastUnity: proposal?.details_ballotAlignment_i
    }
  }
  return {
    unity: 0,
    quorum: 0
  }
}
export function salary (proposal) {
  if (proposal) {
    if (proposal.__typename === PROPOSAL_TYPE.ARCHETYPE) {
      return proposal.details_annualUsdSalary_a
    }
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND && proposal.suspend) {
      const tempProposal = proposal.suspend[0]
      if (tempProposal.__typename === PROPOSAL_TYPE.ARCHETYPE) {
        return tempProposal.details_annualUsdSalary_a
      }
    }
    if (proposal.__typename === PROPOSAL_TYPE.ROLE) {
      return proposal.role[0].details_annualUsdSalary_a
    }
    if (proposal.__typename === PROPOSAL_TYPE.EDIT) {
      if (proposal.original[0].__typename === PROPOSAL_TYPE.ROLE) {
        return proposal.original[0].role[0].details_annualUsdSalary_a
      }
    }
  }
  return null
}
export function compensation (proposal, daoSettings) {
  if (!proposal.details_rewardAmount_a || !proposal.details_pegAmount_a || !proposal.details_voiceAmount_a) return undefined
  const [reward, rewardToken] = proposal.details_rewardAmount_a.split(' ')
  const [peg, pegToken] = proposal.details_pegAmount_a.split(' ')
  const [voice, voiceToken] = proposal.details_voiceAmount_a.split(' ')

  const parseReward = daoSettings.rewardToPegRatio * parseFloat(reward)
  const tooltip = `${parseFloat(reward).toFixed(0)} ${rewardToken} - ${parseFloat(peg).toFixed(0)} ${pegToken} - ${parseFloat(voice).toFixed(0)} ${voiceToken}`

  const compensation = parseReward + parseFloat(peg)
  return {
    amount: compensation.toString(),
    tooltip
  }
}

export function capacity (proposal) {
  if (proposal) {
    if (proposal.__typename === PROPOSAL_TYPE.ARCHETYPE) {
      // TODO: Is this gone?
      return proposal.details_fulltimeCapacityX100_i
    }
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) {
      const tempProposal = proposal.suspend[0]
      if (tempProposal.__typename === PROPOSAL_TYPE.ARCHETYPE) {
        return 0
      }
    }
  }
}
export function deferred (proposal) {
  if (proposal) {
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) proposal = proposal.suspend[0]
    if (proposal.__typename === PROPOSAL_TYPE.EDIT) proposal = proposal.original[0]
    if (proposal.__typename === PROPOSAL_TYPE.ROLE) {
      return {
        value: proposal.details_deferredPercX100_i,
        min: proposal.details_approvedDeferredPercX100_i,
        max: 100
      }
    }
    if (proposal.__typename === PROPOSAL_TYPE.EDIT) {
      return {
        value: proposal.details_deferredPercX100_i,
        min: proposal.original[0].role[0].details_minDeferredX100_i,
        max: 100
      }
    }
    if (proposal.__typename === PROPOSAL_TYPE.ARCHETYPE) {
      return {
        value: proposal.details_deferredPercX100_i,
        min: proposal.details_minDeferredX100_i,
        max: 100
      }
    }
    if (proposal.__typename === PROPOSAL_TYPE.PAYOUT) {
      if (proposal.details_isCustom_i) return

      return {
        value: proposal.details_deferredPercX100_i,
        max: 100
      }
    }
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) {
      const tempProposal = proposal.suspend[0]
      if (tempProposal.__typename === PROPOSAL_TYPE.ARCHETYPE) {
        return {
          value: tempProposal.details_deferredPercX100_i,
          min: tempProposal.details_minDeferredX100_i,
          max: 100
        }
      }
    }
  }

  return null
}
export function commit (proposal) {
  if (proposal.__typename === PROPOSAL_TYPE.EDIT) proposal = proposal.original[0]

  if (proposal.lastimeshare?.[0]?.details_timeShareX100_i !== undefined) {
    return {
      value: proposal.lastimeshare[0].details_timeShareX100_i,
      min: 0,
      max: proposal.details_timeShareX100_i
    }
  }
  if (proposal.details_timeShareX100_i) {
    return {
      value: proposal.details_timeShareX100_i,
      min: 0,
      max: 0
    }
  }
  return undefined
}
export function start (proposal) {
  if (proposal) {
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) proposal = proposal.suspend[0]
    if (proposal.__typename === PROPOSAL_TYPE.EDIT && proposal.original) {
      const date = proposal.original[0].start[0].details_startTime_t
      return dateToString(date)
    }
    if (proposal.__typename === PROPOSAL_TYPE.ROLE) {
      if (!proposal.start) return null
      if (proposal.start.length > 0) {
        const date = proposal.start[0].details_startTime_t
        return dateToString(date)
      }
      return null
    }
    if (proposal.__typename === PROPOSAL_TYPE.ABILITY) {
      if (!proposal.start) return null
      if (proposal.start.length > 0) {
        const date = proposal.start[0].details_startTime_t
        return dateToString(date)
      }
      return null
    }
  }
  return null
}

export function tokens (proposal, periodsOnCycle, daoSettings, isDefaultBadgeMultiplier) {
  if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) proposal = proposal.suspend[0]
  if (proposal.__typename === PROPOSAL_TYPE.EDIT) proposal = proposal.original[0]
  if (proposal.__typename === PROPOSAL_TYPE.ABILITY) proposal = proposal.badge[0]
  if (proposal) {
    let utilityValue = 0
    let cashValue = 0
    let voiceValue = 0
    if (proposal.__typename === PROPOSAL_TYPE.QUEST_START) {
      utilityValue = parseFloat(proposal.details_rewardAmount_a)
      cashValue = parseFloat(proposal.details_pegAmount_a)
      voiceValue = parseFloat(proposal.details_voiceAmount_a)
    }

    if (proposal.__typename === PROPOSAL_TYPE.QUEST_PAYOUT) {
      utilityValue = parseFloat(proposal.queststart[0].details_rewardAmount_a)
      cashValue = parseFloat(proposal.queststart[0].details_pegAmount_a)
      voiceValue = parseFloat(proposal.queststart[0].details_voiceAmount_a)
    }

    if (proposal.__typename === PROPOSAL_TYPE.PAYOUT) {
      utilityValue = parseFloat(proposal.details_rewardAmount_a)
      cashValue = parseFloat(proposal.details_pegAmount_a)
      voiceValue = parseFloat(proposal.details_voiceAmount_a)
    }
    if (proposal.__typename === PROPOSAL_TYPE.ROLE) {
      const [amount] = proposal.details_usdSalaryValuePerPhase_a.split(' ')
      const usdAmount = parseFloat(amount) * periodsOnCycle * commit(proposal).value * 0.01
      utilityValue = (usdAmount * deferred(proposal).value * 0.01 / daoSettings.rewardToPegRatio)
      cashValue = (usdAmount * (1 - deferred(proposal).value * 0.01))
      voiceValue = usdAmount
    }
    if (proposal.__typename === PROPOSAL_TYPE.EDIT && proposal.original) {
      utilityValue = parseFloat(proposal.original[0].details_rewardSalaryPerPeriod_a)
      cashValue = parseFloat(proposal.original[0].details_pegSalaryPerPeriod_a)
      voiceValue = parseFloat(proposal.original[0].details_voiceSalaryPerPeriod_a)
    }
    if (proposal.__typename === PROPOSAL_TYPE.BADGE) {
      return [
        {
          // label: `Utility Token Multiplier (${this.$store.state.dao.settings.rewardToken})`,
          label: 'Utility Token Multiplier',
          tooltip: 'Utility Token multipliers factor in an additional amount on top of your current claims, for example a multiplier of 1.1x will give you 1.1 times the amount of tokens of your claim.',
          type: 'utility',
          symbol: daoSettings.rewardToken,
          value: parseFloat(proposal.details_rewardCoefficientX10000_i / coefficientBase),
          coefficient: true,
          coefficientPercentage: isDefaultBadgeMultiplier ? 1 : parseFloat(proposal.details_rewardCoefficientX10000_i / coefficientBase)
        },
        {
          label: 'Cash Token Multiplier',
          // label: `Cash Token Multiplier (${this.$store.state.dao.settings.pegToken})`,
          tooltip: 'Cash Token Token multipliers factor in an additional amount on top of your current claims, for example a multiplier of 1.1x will give you 1.1 times the amount of tokens of your claim.',
          type: 'cash',
          symbol: daoSettings.pegToken,
          value: parseFloat(proposal.details_pegCoefficientX10000_i / coefficientBase),
          coefficient: true,
          coefficientPercentage: isDefaultBadgeMultiplier ? 1 : parseFloat(proposal.details_pegCoefficientX10000_i / coefficientBase)
        },
        {
          // label: `Voice Token Multiplier (${this.$store.state.dao.settings.voiceToken})`,
          label: 'Voice Token Multiplier',
          tooltip: 'Voice Token multipliers factor in an additional amount on top of your current claims, for example a multiplier of 1.1x will give you 1.1 times the amount of tokens of your claim.',
          type: 'voice',
          symbol: daoSettings.voiceToken,
          value: parseFloat(proposal.details_voiceCoefficientX10000_i) / coefficientBase,
          coefficient: true,
          coefficientPercentage: isDefaultBadgeMultiplier ? 1 : parseFloat(proposal.details_voiceCoefficientX10000_i / coefficientBase)
        }
      ]
    }
    if (proposal.__typename === PROPOSAL_TYPE.ARCHETYPE) {
      const [amount] = proposal.details_annualUsdSalary_a.split(' ')
      const usdAmount = amount ? parseFloat(amount) / 12 : 0
      const deferred = parseFloat(proposal.details_minDeferredX100_i || 0)
      utilityValue = (usdAmount * deferred * 0.01 / daoSettings.rewardToPegRatio)
      cashValue = (usdAmount * (1 - deferred * 0.01))
      voiceValue = usdAmount
    }
    if (proposal.__typename === PROPOSAL_TYPE.SUSPEND) {
      const tempProposal = proposal.suspend[0]
      if (tempProposal.__typename === PROPOSAL_TYPE.ARCHETYPE) {
        const [amount] = tempProposal.details_annualUsdSalary_a.split(' ')
        const usdAmount = amount ? parseFloat(amount) / 12 : 0
        const deferred = parseFloat(proposal.details_minDeferredX100_i || 0)
        utilityValue = (usdAmount * deferred * 0.01 / daoSettings.rewardToPegRatio)
        cashValue = (usdAmount * (1 - deferred * 0.01))
        voiceValue = usdAmount
      }
    }
    return [
      {
        label: `Utility Token (${daoSettings.rewardToken})`,
        type: 'utility',
        value: utilityValue
      },
      {
        label: `Cash Token (${daoSettings.pegToken})`,
        type: 'cash',
        value: cashValue
      },
      {
        label: 'Voice Token',
        type: 'voice',
        value: voiceValue
      }
    ]
  }
  return null
}

export async function getPeriods (data, selectedDao, daoSettings, apollo) {
  let periodCount = 0
  let periodResponse = []
  let periods = []
  let start
  let end
  let firstPeriod
  if ((data.details_state_s === PROPOSAL_STATE.APPROVED || data.details_state_s === PROPOSAL_STATE.ARCHIVED) && data.details_periodCount_i) {
    periodCount = data.details_periodCount_i
    periodResponse = await apollo.query({
      query: require('~/query/periods/dao-periods-range.gql'),
      variables: {
        daoId: selectedDao.docId,
        start: data.start[0]?.details_startTime_t,
        count: data.details_periodCount_i
      }
    })
    firstPeriod = periodResponse.data.getDao.period[0]
    periodResponse = periodResponse.data.getDao.period.map((value, index) => {
      return {
        docId: value.docId,
        label: value.details_startTime_t,
        phase: value.details_label_s,
        startDate: value.details_startTime_t,
        endDate: value.next[0].end
      }
    })
    // Calculate start and end time for all periods
    start = new Date(periodResponse[0].startDate)

    // Add the periods
    periods = []
    for (let i = 0; i < periodCount; i += 1) {
      const claimed = data.claimed
        ? data.claimed.some(c => c.docId === periodResponse[i].docId)
        : false
      periods.push({
        start: new Date(periodResponse[i].startDate),
        end: new Date(periodResponse[i].endDate),
        title: PERIOD_NAMES.includes(periodResponse[i].phase)
          ? periodResponse[i].phase
          : 'First Quarter',
        claimed: claimed,
        claimable: new Date(periodResponse[i].endDate) < Date.now() && !claimed
      })
    }
    end = periods[periods.length - 1].end
  }
  return { start, end, periods, firstPeriod, extend: _getExtendObject(end, daoSettings) }
}

function _getExtendObject (endDate, daoSettings) {
  // To ensure no disruption in assignment, an extension must be
  // created more than 1 voting period before it expires
  // const VOTE_DURATION = daoSettings.votingDurationSec * 1000
  const PERIOD_DURATION = daoSettings.periodDurationSec * 1000
  return {
    start: new Date(endDate - 3 * PERIOD_DURATION),
    end: new Date(endDate + (PERIOD_DURATION * 2))
  }
}

// TODO
export function claims (periods) {
  if (periods) {
    return periods.reduce((result, p) => {
      if (!p.claimed && p.end < this.now) {
        return result + 1
      }
      return result
    }, 0)
  }
  return 0
}
