import Organizations from './organizations.vue'

export default {
  title: 'Profiles/Organizations',
  component: Organizations,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Organizations },
  template: `
    <organizations v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
