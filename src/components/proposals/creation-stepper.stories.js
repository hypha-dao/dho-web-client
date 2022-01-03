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
      label: 'Proposal type',
      component: 'step-proposal-type'
    },
    {
      key: 'description',
      label: 'Description',
      component: 'step-description'
    },
    {
      key: 'date',
      label: 'Date / Duration',
      component: 'step-date-duration'
    },
    {
      key: 'compensation',
      label: 'Compensation',
      component: 'step-compensation'
    },
    {
      key: 'review',
      label: 'Review',
      component: 'step-review'
    }
  ]
}

export const Base = Template.bind({})
