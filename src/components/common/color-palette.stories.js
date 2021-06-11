import ColorPalette from './color-palette.vue'

export default {
  title: 'Common/Color Palette',
  component: ColorPalette,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ColorPalette },
  template: `
    <color-palette v-bind="$props" />
  `
})

export const Base = Template.bind({})
