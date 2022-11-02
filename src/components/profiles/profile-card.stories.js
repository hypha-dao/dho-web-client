import ProfileCard from './profile-card.vue'
import Vuex from 'vuex'

export default {
  title: 'Profiles/Profile Card',
  component: ProfileCard,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProfileCard },
  template: `
    <profile-card v-bind="$props" />
  `,
  store: new Vuex.Store({
    modules: {

    }
  })
})

export const Example = Template.bind({})
Example.args = {
  joinedDate: '2021-03-01T00:34:33.500',
  username: 'gh.hypha'
}

export const Base = Template.bind({})
Base.args = {
  ...Example.args
}
