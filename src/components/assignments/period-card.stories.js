import PeriodCard from './period-card.vue'

export default {
  title: 'Assignments/Period Card',
  component: PeriodCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PeriodCard },
  template: `
    <period-card v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  start: new Date('2021-05-19T19:14:00.000Z'),
  end: new Date('2021-05-26T11:15:00.000Z'),
  title: 'First Quarter',
  claimed: false
}

export const Base = Template.bind({})
