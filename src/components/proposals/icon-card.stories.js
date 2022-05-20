import IconCard from './icon-card.vue'

export default {
  title: 'Proposals/IconCard',
  component: IconCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IconCard },
  template: `
    <icon-card v-bind="$props" />
  `
})

export const Base = Template.bind({})
Base.args = {
  name: 'fa fa-edit',
  size: 'lg',
  color: 'primary'
}
