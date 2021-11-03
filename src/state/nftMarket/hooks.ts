import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { isAddress } from 'utils'
import { fetchCollection, fetchCollections } from './reducer'
import { State } from '../types'
import { NftFilter, NftFilterLoadingState, NftToken, UserNftsState } from './types'

const MAX_GEN0_ID = 4

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
  }, [dispatch])
}

export const useFetchCollection = (collectionAddress: string) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollection(collectionAddress))
  }, [dispatch, collectionAddress])
}

// Returns a function that fetches more NFTs for specified bunny id
// as well as updating existing PB NFTs in state
// Note: PancakeBunny specific
export const useFetchByBunnyIdAndUpdate = (bunnyId: string) => {
  const { latestPancakeBunniesUpdateAt, isUpdatingPancakeBunnies } = useSelector(
    (state: State) => state.nftMarket.data.loadingState,
  )
  return { isUpdatingPancakeBunnies, latestPancakeBunniesUpdateAt }
}

export const useLoadingState = () => {
  return useSelector((state: State) => state.nftMarket.data.loadingState)
}

export const useGetCollections = () => {
  return useSelector((state: State) => state.nftMarket.data.collections)
}

export const useGetCollection = (collectionAddress: string) => {
  const checksummedCollectionAddress = isAddress(collectionAddress) || ''
  const collections = useGetCollections()
  return collections[checksummedCollectionAddress]
}

export const useNftsFromCollection = (collectionAddress: string) => {
  const checksummedCollectionAddress = isAddress(collectionAddress) || ''
  const nfts: NftToken[] = useSelector((state: State) => state.nftMarket.data.nfts[checksummedCollectionAddress])
  return nfts
}

export const useGetAllBunniesByBunnyId = (bunnyId: string) => {
  return []
}

export const useGetNFTInitializationState = () => {
  return useSelector((state: State) => state.nftMarket.initializationState)
}

export const useUserNfts = (): UserNftsState => {
  return useSelector((state: State) => state.nftMarket.data.user)
}

export const useHasGen0Nfts = (): boolean => {
  const userNfts = useSelector((state: State) => state.nftMarket.data.user)
  return userNfts.nfts.some((nft) => nft.attributes && Number(nft.attributes[0]?.value) <= MAX_GEN0_ID)
}

export const useGetNftFilters = (collectionAddress: string) => {
  const collectionFilter: NftFilter = useSelector((state: State) => state.nftMarket.data.filters[collectionAddress])
  return collectionFilter ? collectionFilter.activeFilters : {}
}

export const useGetNftFilterLoadingState = (collectionAddress: string) => {
  const collectionFilter: NftFilter = useSelector((state: State) => state.nftMarket.data.filters[collectionAddress])
  return collectionFilter ? collectionFilter.loadingState : NftFilterLoadingState.IDLE
}

export const useGetNftOrdering = (collectionAddress: string) => {
  const collectionFilter: NftFilter = useSelector((state: State) => state.nftMarket.data.filters[collectionAddress])
  return collectionFilter ? collectionFilter.ordering : { field: 'currentAskPrice', direction: 'asc' as 'asc' | 'desc' }
}

export const useGetNftShowOnlyOnSale = (collectionAddress: string) => {
  const collectionFilter: NftFilter = useSelector((state: State) => state.nftMarket.data.filters[collectionAddress])
  return collectionFilter ? collectionFilter.showOnlyOnSale : true
}
