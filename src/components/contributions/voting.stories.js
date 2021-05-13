import Voting from './voting.vue'

export default {
  title: 'Contributions/Voting',
  component: Voting,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Voting },
  template: `
    <voting v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {

}

export const Base = Template.bind({})
