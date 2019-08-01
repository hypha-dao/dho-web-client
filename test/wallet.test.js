import { describe } from 'riteway'
import wallet from '../src/wallet'

describe('Wallet', async assert => {
  console.log('/init wallet')

  await wallet.init()

  console.log('/generate keys')

  const keys = await wallet.generateKeys()

  assert({
    given: 'generateKeys called',
    should: 'generate private and public keys',
    actual: Object.keys(keys),
    expected: ['privateKey', 'publicKey']
  })

  console.log('/create account')
})
