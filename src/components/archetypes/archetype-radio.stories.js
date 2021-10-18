import ArchetypeRadio from './archetype-radio.vue'

export default {
  title: 'Archetypes/Radio',
  component: ArchetypeRadio,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ArchetypeRadio },
  template: `
    <archetype-radio v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  archetype: {
    details_title_s: 'Building and Developing B4',
    details_description_s: 'Lorem ipsum archetype description text. This is probably a lot longer in practice.',
    details_annualUsdSalary_a: '150000.00 USD'
  },
  selected: false
}
