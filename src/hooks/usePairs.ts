import { TokenAmount, Pair, Currency } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Interface } from '@ethersproject/abi'
import { wrappedCurrency } from '../utils/wrappedCurrency'

import { useSingleContractInterfaceMultipleData } from '../state/multicall/hooks'
import FactoryABI from '../config/abi/Factory.json'
import { FACTORY_ADDRESS } from '../config/constants'

const FACTORY_INTERFACE = new Interface(FactoryABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  )

  const results = useSingleContractInterfaceMultipleData(
      FACTORY_ADDRESS,
      FACTORY_INTERFACE,
      'getReserves',
      tokens.map(([tokenA, tokenB]) =>
          tokenA && tokenB && !tokenA.equals(tokenB) ? [tokenA.address, tokenB.address] : undefined
      ),
  )

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
      ]
    })
  }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
