import HeaderView from './header-view.vue'

export default {
  title: 'Login/Header',
  component: HeaderView,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HeaderView },
  template: `
    <header-view v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  step: 'welcome',
  steps: {
    welcome: 'welcome',
    login: 'login',
    register: 'register'
  }
}

export const Base = Template.bind({})
Base.args = {
  step: 'welcome',
  steps: {
    welcome: 'welcome',
    login: 'login',
    register: 'register'
  }
}
