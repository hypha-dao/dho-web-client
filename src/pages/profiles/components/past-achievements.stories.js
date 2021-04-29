import PastAchievements from './past-achievements.vue'

export default {
  title: 'Profiles/Past Achievements',
  component: PastAchievements,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PastAchievements },
  template: `
    <past-achievements v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
