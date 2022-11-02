import SettingsDesign from './settings-design.vue'

export default {
  title: 'Dao/Settings Design',
  component: SettingsDesign,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SettingsDesign },
  template: `
    <settings-design v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  form: {
    logo: '',
    extendedLogo: '',
    primaryColor: '#242f5d',
    secondaryColor: '#3F64EE',
    textColor: '#ffffff',
    pattern: '',
    patternColor: '#3E3B46',
    patternOpacity: '30',
    patternBase64: '',

    // splashpage
    splashBackgroundImage: '',

    // banners
    dashboardBackgroundImage: '',
    dashboardTitle: '',
    dashboardParagraph: '',

    proposalsBackgroundImage: '',
    proposalsTitle: '',
    proposalsParagraph: '',

    membersBackgroundImage: '',
    membersTitle: '',
    membersParagraph: '',

    organisationBackgroundImage: '',
    organisationTitle: '',
    organisationParagraph: ''
  },
  isAdmin: true
}

export const Base = Template.bind({})
Base.args = {
  form: {
    logo: '',
    extendedLogo: '',
    primaryColor: '#242f5d',
    secondaryColor: '#3F64EE',
    textColor: '#ffffff',
    pattern: '',
    patternColor: '#3E3B46',
    patternOpacity: '30',
    patternBase64: '',

    // splashpage
    splashBackgroundImage: '',

    // banners
    dashboardBackgroundImage: '',
    dashboardTitle: '',
    dashboardParagraph: '',

    proposalsBackgroundImage: '',
    proposalsTitle: '',
    proposalsParagraph: '',

    membersBackgroundImage: '',
    membersTitle: '',
    membersParagraph: '',

    organisationBackgroundImage: '',
    organisationTitle: '',
    organisationParagraph: ''
  },
  isAdmin: true
}
