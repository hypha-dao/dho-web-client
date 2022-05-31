export default function ipfsy (cid) {
  return process.env.IPFS_GATEWAY + cid.replace(/:.*$/, '')
}
