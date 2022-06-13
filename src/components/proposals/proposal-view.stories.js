import ProposalView from './proposal-view.vue'
import Vuex from 'vuex'

export default {
  title: 'Proposals/View',
  component: ProposalView,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProposalView },
  template: `
    <proposal-view v-bind="$props" />
  `,
  store: new Vuex.Store({
    modules: {
      dao: {
        namespaced: true,
        state: {},
        getters: {
          selectedDao: (state) => {
            return {
              name: 'hypha'
            }
          },
          daoSettings: (state) => {
            return {
              periodDurationSec: 86400
            }
          }
        }
      }
    }
  })
})

export const Example = Template.bind({})
Example.args = {
  creator: 'lukegravdent',
  description: '',
  periodCount: 12,
  preview: false,
  start: 'Jan 3',
  subtitle: 'Building and Developing B4',
  tags: [
    {
      label: 'Assignment',
      color: 'primary'
    },
    {
      label: 'Circle One',
      color: 'primary',
      outline: true
    }
  ],
  title: 'Hypha Frontend Dev',
  tokens: [
    {
      label: 'husd',
      value: 1745.45
    },
    {
      label: 'hvoice',
      value: 5124.24
    },
    {
      label: 'hypha',
      value: 120.32
    }
  ],
  type: 'Assignment',
  url: 'https://www.google.com',
  voting: {
    quorum: 0.12,
    unity: 0.85
  },
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
    }
  ]
}

export const Base = Template.bind({})

export const GenericContribution = Template.bind({})
GenericContribution.args = {
  title: 'Test GenericContribution ',
  tags: [
    {
      label: 'Generic Contribution',
      color: 'primary',
      text: 'white'
    }
  ],
  tokens: [
    {
      label: 'HYPHA',
      value: '1000000',
      icon: 'hypha.svg'
    },
    {
      label: 'Cash Token',
      value: '11000',
      icon: 'husd.svg'
    },
    {
      label: 'Voice Token',
      value: '10000',
      icon: 'hvoice.svg'
    }
  ],
  deferred: {
    value: 80
  },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam.',
  url: 'https://www.google.com/',
  creator: 'lukegravdent',
  type: 'Payout',
  withToggle: false
}

export const RoleArchetype = Template.bind({})
RoleArchetype.args = {
  title: 'Test Role',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam.',
  tags: [
    {
      label: 'Role Archetype',
      color: 'primary',
      text: 'white'
    }
  ],
  tokens: [
    {
      label: 'HYPHA',
      value: '1000000',
      icon: 'hypha.svg'
    },
    {
      label: 'Cash Token',
      value: '11000',
      icon: 'husd.svg'
    },
    {
      label: 'Voice Token',
      value: '10000',
      icon: 'hvoice.svg'
    }
  ],
  salary: 90909,
  deferred: {
    min: 89
  },
  capacity: 1000,
  creator: 'lukegravdent',
  type: 'Role',
  withToggle: false
}

export const RoleAssignment = Template.bind({})
RoleAssignment.args = {
  title: 'Test Archetype',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam.',
  tags: [
    {
      label: 'Role Assignment',
      color: 'primary',
      text: 'white'
    }
  ],
  tokens: [
    {
      label: 'HYPHA',
      value: '1000000',
      icon: 'hypha.svg'
    },
    {
      label: 'Cash Token',
      value: '11000',
      icon: 'husd.svg'
    },
    {
      label: 'Voice Token',
      value: '10000',
      icon: 'hvoice.svg'
    }
  ],
  commit: {
    value: 80
  },
  deferred: {
    value: 90
  },
  periodCount: 10,
  creator: 'lukegravdent',
  type: 'Assignment',
  withToggle: true
}

export const Badge = Template.bind({})
Badge.args = {
  title: 'Test Badge',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam.',
  restrictions: 24,
  icon: 'icon:fas  fa-address-book',
  tokens: [
    {
      label: 'Utility Token Multiplier',
      icon: 'hypha.svg',
      symbol: 'Hypha',
      value: 1000,
      coefficient: true,
      coefficientPercentage: 1.04
    },
    {
      label: 'Cash Token Multiplier',
      icon: 'husd.svg',
      symbol: 'Husd',
      value: 102000,
      coefficient: true,
      coefficientPercentage: 1.2
    },
    {
      label: 'Voice Token Multiplier',
      icon: 'hvoice.svg',
      symbol: 'hvoice',
      value: 102000,
      coefficient: true,
      coefficientPercentage: 1.2
    }
  ],
  creator: 'lukegravdent',
  type: 'Badge',
  withToggle: false
}

export const BadgeAssigment = Template.bind({})
BadgeAssigment.args = {
  title: 'Test Assignbadge',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis a cras semper auctor neque vitae tempus quam.',
  tokens: [
    {
      label: 'Utility Token Multiplier',
      icon: 'hypha.svg',
      symbol: 'Hypha',
      value: 1000,
      coefficient: true,
      coefficientPercentage: 1.04
    },
    {
      label: 'Cash Token Multiplier',
      icon: 'husd.svg',
      symbol: 'Husd',
      value: 102000,
      coefficient: true,
      coefficientPercentage: 1.2
    },
    {
      label: 'Voice Token Multiplier',
      icon: 'hvoice.svg',
      symbol: 'hvoice',
      value: 102000,
      coefficient: true,
      coefficientPercentage: 1.2
    }
  ],
  periodCount: 10,
  icon: 'icon:fas  fa-address-book',
  creator: 'lukegravdent',
  type: 'Assignbadge',
  withToggle: false
}
