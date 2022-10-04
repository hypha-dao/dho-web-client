import CommentsWidget from './comments-widget.vue'

export default {
  title: 'Proposals/Comments Widget',
  component: CommentsWidget,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CommentsWidget },
  template: `
    <comment-widget v-bind='$props' />
  `
})

export const Example = Template.bind({})
Example.args = {
  comments: [
    {
      id: '1',
      author: 'johnnyhypha1',
      content: 'This is test comment.',
      createdDate: '2022-05-25T00:00:00Z',
      numberOfLikes: 1,
      commentAggregate: { count: 1, __typename: 'CommentAggregateResult' },
      replies: [{
        id: '2',
        author: 'johnnyhypha1',
        content: 'This is nested comment.',
        createdDate: '2022-05-25T01:00:00Z',
        numberOfLikes: 2
      }]
    }
  ]
}

export const Base = Template.bind({})
Base.args = {
  comments: [{}]
}
