import EcosystemCard from './ecosystem-card.vue'

export default {
  title: 'Ecosystem Card',
  component: EcosystemCard
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { EcosystemCard },
  template: `
    <ecosystem-card v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can all the params you want.
Example.args = {

}

export const Base = Template.bind({})
