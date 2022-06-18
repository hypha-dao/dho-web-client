import CommentInput from './comment-input.vue'

export default {
  title: 'Proposals/Comment Input',
  component: CommentInput,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CommentInput },
  template: `
    <comment-input v-bind='$props' />
  `
})

export const Example = Template.bind({})
Example.args = {}

export const Base = Template.bind({})
