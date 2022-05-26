// #STORYSPAWNER
// Please don't delete the above storyspawner line.
// This is an auto generated story created by the Storybook Spawner.
// Author: Pugakn
// https://github.com/pugakn/StorySpawner

import WalletAdresses from './wallet-adresses.vue'

export default {
  title: 'Profiles/ Wallet Adresses',
  component: WalletAdresses,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { WalletAdresses },
  template: `
    <wallet-adresses v-bind="$props" />
  `
})

export const Example = Template.bind({})
// These are the params for the example story. You can add all the params you want.
Example.args = {

}
