import PPP from '@hypha-dao/ppp-client-api'

export default async ({ store }) => {
  PPP.configure(process.env.PPP_ENV, 'BASE_APP')
  store.$ppp = PPP
}
