import ContributionItem from './contribution-item.vue'

export default {
  title: 'Profiles/Contribution Item',
  component: ContributionItem,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ContributionItem },
  template: `
    <contribution-item v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  contribution: {
    // TODO: Can dates be specified in a way that tests work consistently?
    created: new Date('2021-05-19T19:14:00.000Z'),
    title: 'Bridge Contributions May 15 - Jun 1 2021',
    tokens: [
      {
        label: 'HUSD',
        value: 1701.84,
        icon: 'husd.svg'
      },
      {
        label: 'HVOICE',
        value: 4862.42,
        icon: 'hvoice.svg'
      },
      {
        label: 'HYPHA',
        value: 94.81,
        icon: 'hypha.svg'
      }
    ]
  }
}
