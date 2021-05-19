import About from './about.vue'

export default {
  title: 'Profiles/About',
  component: About,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { About },
  template: `
    <about v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
  bio: 'Ceres anguibus ut ex erat _tibi avidus_ Cithaeron, idem amor sinus illud, hanc arcet quatiens de? Quoque alumnus Ithacis superosque [properant instat purpura](#iuvencos-deae), si largoque geminaque cunarum [nova tura](#intentare). Deprendit flebant incidit marmoreoque caecae raucis sine.\n\n> Est quam deae amato dentes institerant vitio Iuppiter. Deus mei eripuit Farfarus positae inque ut ensis Phegeius mendosa, est tenus est ferro patet; undis.\n\nRes **ultor rotae Iovemque** palude lingua. Animas astu ne squamae noctis, in iacent torta vidi tantum addidit cruentior taceam, vertit!\n\n1.  Quaecumque quoque murra descendunt tulit rem nefanda\n2.  Posses natam tractus potentior gramina nullaque satis\n3.  In dixere gaudia\n4.  Angues et ulla\n5.  Frustra plumbum\n6.  Viderat foret sit hospes cum\n\nEst iam, deae quaerit texerat. [Sustinet](#serpentibus-pulsata-haec) hac quota vero egredior aurea non veram repono turbata. Excutit eurytus, non senex facta, et toroque tenuit et gentes volumine.'
}

export const Base = Template.bind({})
