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
    announcements: [{ title: 'Test', message: 'Test', enabled: false }],
    alerts: [{ level: 'positive', content: 'Test', enabled: false }]
  },
  isAdmin: true,
  isHypha: true
}

export const Base = Template.bind({})
Base.args = {
  form: {
    announcements: [{ title: 'Test', message: 'Test', enabled: false }],
    alerts: [{ level: 'positive', content: 'Test', enabled: false }]
  },
  isAdmin: true,
  isHypha: true
}
