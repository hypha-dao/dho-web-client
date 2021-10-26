import BadgeRadio from './badge-radio.vue'

export default {
  title: 'Badges/Radio',
  component: BadgeRadio,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BadgeRadio },
  template: `
    <badge-radio v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  badge: {
    details_title_s: 'Treasurer',
    details_description_s: 'Lorem ipsum badge description text. This is probably a lot longer in practice.'
  },
  selected: false
}
