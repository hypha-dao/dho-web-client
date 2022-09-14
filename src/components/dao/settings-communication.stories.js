import SettingsCommunication from './settings-communication.vue'

export default {
  title: 'Dao/Settings Communication',
  component: SettingsCommunication,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SettingsCommunication },
  template: `
    <settings-communication v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  form: {
    alerts: [{ content: 'Test', enabled: true, level: 'default' }]
  },
  isAdmin: true
}

export const Base = Template.bind({})
