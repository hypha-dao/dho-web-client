import EmojiPicker from './emoji-picker.vue'

export default {
  title: 'Proposals/Emoji Picker',
  component: EmojiPicker,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { EmojiPicker },
  template: `
    <emoji-picker v-bind='$props' />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
