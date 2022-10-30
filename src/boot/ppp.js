import PPP from '@hypha-dao/ppp-client-api'

export default async ({ store }) => {
  console.log('PPP_ENV: ', process.env.PPP_ENV)
  PPP.configure(process.env.PPP_ENV, 'base-app')
  store.$ppp = PPP
}
