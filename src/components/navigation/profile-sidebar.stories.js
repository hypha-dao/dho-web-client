import ProfileSidebar from './profile-sidebar.vue'
import Store from '../../store/index'

export default {
  title: 'Navigation/Profile Sidebar',
  component: ProfileSidebar,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProfileSidebar },
  template: `
    <div style="width: 800px; height: 800px">
      <profile-sidebar v-bind="$props" />
    </div>
  `,
  store: Store
})

export const Example = Template.bind({})
Example.args = {
  profile: {
    name: 'Johnny Cage',
    username: 'johnnyhypha1',
    avatar: 'avatar-placeholder.png'
  }
}

export const Base = Template.bind({})
Base.args = {
  profile: {}
}
