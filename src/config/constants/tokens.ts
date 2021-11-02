import { ChainId, Token } from '@pancakeswap/sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

interface SerializedTokenList {
  [symbol: string]: SerializedToken
}

export const mainnetTokens = {
  wbnb: new Token(
    MAINNET,
    '0x2707211F7988FF4C088BC03056FCD3bc3287b9e0',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.com/',
  ),
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new Token(MAINNET, '0x2707211F7988FF4C088BC03056FCD3bc3287b9e0', 18, 'BNB', 'BNB', 'https://www.binance.com/'),
  cake: new Token(
    MAINNET,
    '0x4803b453604995AFb73E8400D437DF549529e818',
    18,
    'CAKE',
    'PancakeSwap Token',
    'https://pancakeswap.finance/',
  ),
  busd: new Token(
    MAINNET,
    '0xf2BBef47905fF82Ddc9d2aED27d96a108395BAf6',
    18,
    'BUSD',
    'Beta Finance',
    'https://betafinance.org',
  ),
  usdt: new Token(
      MAINNET,
      '0xB75d3598fD494CD0901470AF2996EbADfe7E34F6',
      18,
      'USDT',
      'Beta Finance',
      'https://betafinance.org',
  ),
  btcb: new Token(
      MAINNET,
      '0x3D1895EF9D4937171fd4482D0Bb7591B3c1aA6A3',
      18,
      'BTC',
      'BTC',
      'https://betafinance.org',
  ),
  eth: new Token(
      MAINNET,
      '0x54107F86D07D70a60584514eecb010e9db10101b',
      18,
      'ETH',
      'ETH',
      'https://betafinance.org',
  ),
 }

export const testnetTokens = {
  wbnb: new Token(
    TESTNET,
    '0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.com/',
  ),
  cake: new Token(
    TESTNET,
    '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    18,
    'CAKE',
    'PancakeSwap Token',
    'https://pancakeswap.finance/',
  ),
  busd: new Token(
    TESTNET,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  syrup: new Token(
    TESTNET,
    '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
    18,
    'SYRUP',
    'SyrupBar Token',
    'https://pancakeswap.finance/',
  ),
  bake: new Token(
    TESTNET,
    '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    18,
    'BAKE',
    'Bakeryswap Token',
    'https://www.bakeryswap.org/',
  ),
}

const tokens = (): TokenList => {
  const chainId = process.env.REACT_APP_CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {})
  }

  return mainnetTokens
}

export const serializeTokens = (): SerializedTokenList => {
  const unserializedTokens = tokens()
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {})

  return serializedTokens
}

export default tokens()
