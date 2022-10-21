import CommentItem from './comment-item.vue'
import Vuex from 'vuex'

export default {
  title: 'Proposals/Comment Item',
  component: CommentItem,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CommentItem },
  template: `
    <comment-item v-bind='$props' />
  `,
  store: new Vuex.Store({
    modules: {

    }
  })
})

export const Example = Template.bind({})
Example.args = {
  id: '1',
  author: 'johnnyhypha1',
  content: 'This is test comment.',
  createdDate: '2022-05-25T00:00:00Z',
  reactions: {
    count: 3,
    users: ['johnnyhypha1']
  },
  commentAggregate: { count: 1 },
  replies: [{
    id: '2',
    author: 'johnnyhypha1',
    content: 'This is nested comment.',
    createdDate: '2022-05-25T01:00:00Z',
    numberOfLikes: 2
  }]
}

export const Base = Template.bind({})
Base.args = {
  ...Example.args
}
