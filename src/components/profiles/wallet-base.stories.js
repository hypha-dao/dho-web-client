import Wallet from './wallet-base.vue'

export default {
  title: 'Profiles/Wallet',
  component: Wallet,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Wallet },
  template: `
    <wallet v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  canRedeem: false,
  more: true,
  username: 'johnnyhypha1',
  wallet: [
    {
      label: 'dSEEDS',
      icon: 'seeds.png',
      value: 2340.78
    },
    {
      label: 'Liquid SEEDS',
      icon: 'seeds.png',
      value: 120034023.99
    },
    {
      label: 'HYPHA',
      icon: 'hypha.svg',
      value: 73929
    },
    {
      label: 'HVoice',
      icon: 'hvoice.svg',
      value: 12346.7832,
      percentage: 2.5
    },
    {
      label: 'HUSD',
      icon: 'husd.svg',
      value: 5200.02,
      redeem: true
    }
  ]
}

export const Base = Template.bind({})
