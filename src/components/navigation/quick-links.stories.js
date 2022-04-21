import QuickLinks from './quick-links.vue'
import Store from '../../store/index'
export default {
  title: 'Navigation/Quick Links',
  component: QuickLinks,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuickLinks },
  template: `
    <quick-links v-bind="$props" />
  `,
  store: Store
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
