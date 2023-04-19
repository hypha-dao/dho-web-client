import CreationStepper from './creation-stepper.vue'

export default {
  title: 'Proposals/Creation Stepper',
  component: CreationStepper,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CreationStepper },
  template: `
    <creation-stepper v-bind='$props' />
  `
})

export const Example = Template.bind({})
Example.args = {
  stepIndex: 1,
  steps: [
    {
      key: 'type',
      index: 1,
      label: 'Proposal type',
      component: 'step-proposal-type'
    },
    {
      key: 'description',
      index: 2,
      label: 'Description',
      component: 'step-details'
    },
    {
      key: 'date',
      index: 3,
      label: 'Date / Duration',
      component: 'step-duration'
    },
    {
      key: 'icon',
      index: 4,
      label: 'Icon selection',
      component: 'step-icon'
    },
    {
      key: 'compensation',
      index: 5,
      label: 'Compensation',
      component: 'step-payout'
    },
    {
      key: 'review',
      index: 6,
      label: 'Review',
      component: 'step-review'
    }
  ]
}

export const Base = Template.bind({})
Base.args = {
  stepIndex: 0,
  steps: [
    {}
  ]
}

export const Contributions = Template.bind({})
Contributions.args = {
  stepIndex: 1,
  steps: [
    {
      key: 'type',
      index: 1,
      label: 'Proposal type',
      component: 'step-proposal-type'
    },
    {
      key: 'description',
      index: 2,
      label: 'Description',
      component: 'step-details'
    },
    {
      key: 'compensation',
      index: 3,
      label: 'Compensation',
      component: 'step-payout'
    },
    {
      key: 'review',
      index: 4,
      label: 'Review',
      component: 'step-review'
    }
  ]
}

export const RecurringActivity = Template.bind({})
RecurringActivity.args = {
  stepIndex: 1,
  steps: [
    {
      key: 'type',
      index: 1,
      label: 'Proposal type',
      component: 'step-proposal-type'
    },
    {
      key: 'description',
      index: 2,
      label: 'Description',
      component: 'step-details'
    },
    {
      key: 'date',
      index: 3,
      label: 'Date / Duration',
      component: 'step-duration'
    },
    {
      key: 'compensation',
      index: 5,
      label: 'Compensation',
      component: 'step-payout'
    },
    {
      key: 'review',
      index: 6,
      label: 'Review',
      component: 'step-review'
    }
  ]
}

export const OrganizationalAsset = Template.bind({})
OrganizationalAsset.args = {
  stepIndex: 1,
  steps: [
    {
      key: 'type',
      index: 1,
      label: 'Proposal type',
      component: 'step-proposal-type'
    },
    {
      key: 'description',
      index: 2,
      label: 'Description',
      component: 'step-details'
    },
    {
      key: 'date',
      index: 3,
      label: 'Date / Duration',
      component: 'step-duration'
    },
    {
      key: 'icon',
      index: 4,
      label: 'Icon selection',
      component: 'step-icon'
    },
    {
      key: 'compensation',
      index: 5,
      label: 'Compensation',
      component: 'step-payout'
    },
    {
      key: 'review',
      index: 6,
      label: 'Review',
      component: 'step-review'
    }
  ]
}
