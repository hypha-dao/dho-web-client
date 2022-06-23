import SettingsGeneral from './settings-general.vue'

export default {
  title: 'Dao/Settings General',
  component: SettingsGeneral,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SettingsGeneral },
  template: `
    <settings-general v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  form: {

    socialChat: 'https://discord.com/channels/722537361480613950/964554877902667787',
    url: 'hypha',
    proposalsCreationEnabled: true,
    membersApplicationEnabled: true,
    removableBannersEnabled: true
  },

  isAdmin: true
}

export const Base = Template.bind({})
