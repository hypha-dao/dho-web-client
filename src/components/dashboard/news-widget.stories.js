import NewsWidget from './news-widget.vue'

export default {
  title: 'dashboard/News Widget',
  component: NewsWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NewsWidget },
  template: `
    <news-widget v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  news: [
    {
      title: 'Welcome to your new DHO',
      date: new Date().setMinutes(7),
      description: 'A lot of things are new but the purpose of the DHO remains the same. Govern decentralized organisations. So you can still vote for proposals, find other members and claim your pay. Go check it out and let us know if you have any questions (Check our Wiki) or reach out to us via the discord “dho-support” channel.',
      author: 'Alex Prate',
      type: 'normal'
    },
    {
      title: 'Adjust commitment',
      date: '10/2/21',
      description: 'You can now adjust your commitment, whenever you are less available than the organization is used to. Just go to your profile, open the assignment and move the slider to the percentage you want to adjust your commitment to. Once you are back you can move the commitment back up, max. to what it was before. Your compensation will be calculated prorated. ',
      author: 'Nila Phi',
      type: 'announcement'
    },
    {
      title: 'Other short news',
      date: '9/15/21 12:22:05',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      author: 'Alex Prate',
      type: 'new feature'
    }
  ]
}

export const Base = Template.bind({})
