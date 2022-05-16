import PeriodCalendarCard from './period-calendar-card.vue'

export default {
  title: 'Assignments/Period Calendar card',
  component: PeriodCalendarCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PeriodCalendarCard },
  template: `
    <period-calendar-card v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  now: new Date('2021-06-10T14:54:00.000Z'),
  start: new Date('2021-06-10T14:45:00.000Z'),
  end: new Date('2021-06-10T14:55:00.000Z'),
  title: 'First Quarter'
}

export const Base = Template.bind({})
