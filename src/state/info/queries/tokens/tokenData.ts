/* eslint-disable no-param-reassign */
import { useState,  } from 'react'
import { TokenData } from 'state/info/types'

interface TokenDatas {
  error: boolean
  data?: {
    [address: string]: TokenData
  }
}

/**
 * Fetch top addresses by volume
 */
const useFetchedTokenDatas = (): TokenDatas => {
  const [fetchState,] = useState<TokenDatas>({error: false})
  return fetchState
}

export default useFetchedTokenDatas
