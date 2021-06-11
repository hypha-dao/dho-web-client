import TokenValue from './token-value.vue'

export default {
  title: 'Common/Token Value',
  component: TokenValue,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TokenValue },
  template: `
    <token-value v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  label: 'DSEEDS',
  icon: 'seeds.png',
  value: 2340.78,
  stacked: true
}

export const Seeds = Template.bind({})
Seeds.args = {
  label: 'LIQUID SEEDS',
  icon: 'seeds.png',
  value: 120034023.99
}

export const Hypha = Template.bind({})
Hypha.args = {
  label: 'HYPHA',
  icon: 'hypha.svg',
  value: 73929
}

export const Hvoice = Template.bind({})
Hvoice.args = {
  label: 'HVOICE',
  icon: 'hvoice.svg',
  value: 12346.7832,
  detail: '2.5%'
}

export const HUSD = Template.bind({})
HUSD.args = {
  label: 'HUSD',
  icon: 'husd.svg',
  value: 5200.02
}

export const Base = Template.bind({})
