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
    title: 'Hypha DAO',
    url: 'hypha',
    proposalsCreationEnabled: true,
    membersApplicationEnabled: true,
    removableBannersEnabled: true,
    socialChat: 'https://discord.com/channels/722537361480613950/964554877902667787'
  },

  isAdmin: true
}

export const Base = Template.bind({})
Base.args = {
  form: {
    title: 'Hypha DAO',
    url: 'hypha',
    proposalsCreationEnabled: true,
    membersApplicationEnabled: true,
    removableBannersEnabled: true,
    socialChat: 'https://discord.com/channels/722537361480613950/964554877902667787'
  },

  isAdmin: true
}
