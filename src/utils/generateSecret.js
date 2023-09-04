const ecc = require('eosjs-ecc')
const sha256 = ecc.sha256

export default async function generateSecret () {
  // Generate a random secret (32 bytes)
  const secret = new Uint8Array(32)
  window.crypto.getRandomValues(secret)

  // Convert the secret to a checksum256 string
  const secretChecksum256 = await sha256(Buffer.from(secret))

  // Hash the secret using SHA256
  // Note: sha256 needs to be called on a byte buffer so we take our secret and convert it
  // back to a byte buffer, then hash that.
  const hashedSecret = sha256(Buffer.from(secretChecksum256, 'hex'))

  // verify here:
  // https://emn178.github.io/online-tools/sha256.html - set input type to "hex"
  // console.log('Generated Secret:', secretChecksum256)
  // console.log('Hashed Secret:', hashedSecret)

  return {
    secret: secretChecksum256,
    hashedSecret
  }
}
