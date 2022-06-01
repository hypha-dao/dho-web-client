export default function ipfsy (cid) {
  if (!cid) {
    console.warn('Invalid cid') // eslint-disable-line no-console
    return undefined
  }
  return process.env.IPFS_GATEWAY + cid.replace(/:.*$/, '')
}
