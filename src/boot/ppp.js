import PPP from '@hypha-dao/ppp-client-api'

export default async ({ store }) => {
  PPP.configure(process.env.PPP_ENV, process.env.PPP_APP_ID)
  store.$ppp = PPP
}
