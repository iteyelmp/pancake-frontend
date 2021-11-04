import { Token } from '@pancakeswap/sdk'
// import tokens from 'config/constants/tokens'

// const { bondly, safemoon } = tokens

interface WarningTokenList {
  [key: string]: Token
}

// TODO 高风险token
const SwapWarningTokens = <WarningTokenList>{
  // safemoon,
  // bondly,
}

export default SwapWarningTokens
