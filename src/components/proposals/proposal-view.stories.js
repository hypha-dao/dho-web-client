import ProposalView from './proposal-view.vue'

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
  `
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
