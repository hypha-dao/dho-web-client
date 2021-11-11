import OrganizationBanner from './organization-banner.vue'

export default {
  title: 'dashboard/Organization Banner',
  component: OrganizationBanner,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OrganizationBanner },
  template: `
    <organization-banner v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
