import Result from './result.vue'

export default {
  title: 'Result/Result',
  component: Result,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Result },
  template: `
    <result v-bind="$props" />
  `
})

export const Base = Template.bind({})
Base.args = {
  title: 'Title',
  status: 'propossed'
}

export const Member = Template.bind({})
Member.args = {
  type: 'Member',
  icon: 'far fa-user',
  title: 'rozziesavage'
}

export const GenericContribution = Template.bind({})
GenericContribution.args = {
  icon: 'fa fa-edit',
  title: 'Frontend development',
  type: 'Payout',
  compensation: '2.17 HVOICE',
  status: 'approved',
  applicant: false
}

export const Badge = Template.bind({})
Badge.args = {
  icon: 'fas fa-award',
  status: 'approved',
  title: 'Treasurer',
  type: 'Badge'
}

export const Role = Template.bind({})
Role.args = {
  icon: 'far fa-user',
  salary: '110000.00 USD',
  status: 'approved',
  title: 'Smart Contract Engineer',
  type: 'Role'
}

export const Assignment = Template.bind({})
Assignment.args = {
  expirationDate: '2021-07-19T14:39:29Z',
  icon: 'far fa-calendar-alt',
  status: 'approved',
  title: 'Widget, Passport & Notification System Backend Developer',
  type: 'Assignment'
}

export const BadgeAssignment = Template.bind({})
BadgeAssignment.args = {
  expirationDate: '2022-01-25T09:55:27Z',
  icon: 'far fa-calendar-alt',
  status: 'approved',
  title: 'Tech Support',
  type: 'Assignbadge'
}
