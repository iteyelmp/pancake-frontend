import { ChainId } from '@pancakeswap/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'http://eth-jrpc.devnet.quarkchain.io:39900',
  [ChainId.TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
}

export default NETWORK_URLS
