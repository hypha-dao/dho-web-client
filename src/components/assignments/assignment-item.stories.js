import AssignmentItem from './assignment-item.vue'

export default {
  title: 'Assignments/Item',
  component: AssignmentItem,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AssignmentItem },
  template: `
    <assignment-item v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  assignment: {
    // TODO: Can dates be specified in a way that tests work consistently?
    start: new Date('2021-05-19T19:14:00.000Z'),
    end: new Date('2021-07-10T01:17:00.000Z'),
    past: false,
    commit: {
      min: 0,
      value: 80,
      max: 80
    },
    deferred: 30,
    periods: [
      {
        start: new Date('2021-05-19T19:14:00.000Z'),
        end: new Date('2021-05-26T11:15:00.000Z'),
        title: 'First Quarter',
        claimed: true
      },
      {
        start: new Date('2021-05-26T11:15:00.000Z'),
        end: new Date('2021-06-02T07:25:00.000Z'),
        title: 'Full Moon',
        claimed: false
      },
      {
        start: new Date('2021-06-02T07:25:00.000Z'),
        end: new Date('2021-06-10T10:54:00.000Z'),
        title: 'Last Quarter',
        claimed: false
      },
      {
        start: new Date('2021-06-10T10:54:00.000Z'),
        end: new Date('2021-06-18T03:55:00.000Z'),
        title: 'New Moon',
        claimed: false,
        extend: true
      },
      {
        start: new Date('2021-06-18T03:55:00.000Z'),
        end: new Date('2021-07-01T21:11:00.000Z'),
        title: 'First Quarter',
        claimed: false,
        extend: true
      },
      {
        start: new Date('2021-07-01T21:11:00.000Z'),
        end: new Date('2021-07-10T01:17:00.000Z'),
        title: 'Full Moon',
        claimed: false,
        extend: true
      }
    ],
    title: 'Senior Frontend Developer DHO',
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
    ],
    usdEquivalent: 150000
  }
}
