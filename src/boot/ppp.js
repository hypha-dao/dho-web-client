import PPP from '@hypha-dao/ppp-client-api'

export default async ({ store }) => {
  PPP.configure(process.env.PPP_ENV, 'base-app')
  store.$ppp = PPP
}
