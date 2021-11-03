import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import isEmpty from 'lodash/isEmpty'
import {
  getNftsFromCollectionApi,
  getNftsMarketData,
  getCollectionsApi,
  getCollectionsSg,
  getUserActivity,
  combineCollectionData,
  getCollectionSg,
  getCollectionApi,
  getNftsFromDifferentCollectionsApi,
  getCompleteAccountNftData,
  getNftsByBunnyIdSg,
  getMarketDataForTokenIds,
  getMetadataWithFallback,
  getPancakeBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
  fetchNftsFiltered,
} from './helpers'
import {
  State,
  Collection,
  ApiCollections,
  TokenIdWithCollectionAddress,
  NFTMarketInitializationState,
  UserNftInitializationState,
  NftToken,
  NftLocation,
  ApiSingleTokenData,
  NftAttribute,
  NftFilterLoadingState,
  NftFilter,
} from './types'

const initialNftFilterState: NftFilter = {
  loadingState: NftFilterLoadingState.IDLE,
  activeFilters: {},
  showOnlyOnSale: true,
  ordering: {
    field: 'currentAskPrice',
    direction: 'asc',
  },
}

const initialState: State = {
  initializationState: NFTMarketInitializationState.UNINITIALIZED,
  data: {
    collections: {},
    nfts: {},
    filters: {},
    loadingState: {
      isUpdatingPancakeBunnies: false,
      latestPancakeBunniesUpdateAt: 0,
    },
    users: {},
    user: {
      userNftsInitializationState: UserNftInitializationState.UNINITIALIZED,
      nfts: [],
      activity: {
        initializationState: UserNftInitializationState.UNINITIALIZED,
        askOrderHistory: [],
        buyTradeHistory: [],
        sellTradeHistory: [],
      },
    },
  },
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const fetchCollections = createAsyncThunk<Record<string, Collection>>('nft/fetchCollections', async () => {
  const [collections, collectionsMarket] = await Promise.all([getCollectionsApi(), getCollectionsSg()])
  return combineCollectionData(collections, collectionsMarket)
})

/**
 * Fetch collection data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const fetchCollection = createAsyncThunk<Record<string, Collection>, string>(
  'nft/fetchCollection',
  async (collectionAddress) => {
    const [collection, collectionMarket] = await Promise.all([
      getCollectionApi(collectionAddress),
      getCollectionSg(collectionAddress),
    ])

    return combineCollectionData([collection], [collectionMarket])
  },
)

/**
 * Fetch all NFT data for a collections by combining data from the API (static metadata)
 * and the Subgraph (dynamic market data)
 * @param collectionAddress
 */
export const fetchNftsFromCollections = createAsyncThunk<
  NftToken[],
  { collectionAddress: string; page: number; size: number }
>('nft/fetchNftsFromCollections', async ({ collectionAddress, page, size }) => {
  try {
    const nfts = await getNftsFromCollectionApi(collectionAddress, size, page)

    if (!nfts?.data) {
      return []
    }

    const tokenIds = Object.values(nfts.data).map((nft) => nft.tokenId)
    const nftsMarket = await getMarketDataForTokenIds(collectionAddress, tokenIds)

    return tokenIds.map((id) => {
      const apiMetadata = nfts.data[id]
      const marketData = nftsMarket.find((nft) => nft.tokenId === id)

      return {
        tokenId: id,
        name: apiMetadata.name,
        description: apiMetadata.description,
        collectionName: apiMetadata.collection.name,
        collectionAddress,
        image: apiMetadata.image,
        attributes: apiMetadata.attributes,
        marketData,
      }
    })
  } catch (error) {
    console.error(`Failed to fetch collection NFTs for ${collectionAddress}`, error)
    return []
  }
})

export const filterNftsFromCollection = createAsyncThunk<
  NftToken[],
  { collectionAddress: string; nftFilters: Record<string, NftAttribute> }
>('nft/filterNftsFromCollection', async ({ collectionAddress, nftFilters }) => {
  try {
    const attrParams = Object.values(nftFilters).reduce(
      (accum, attr) => ({
        ...accum,
        [attr.traitType]: attr.value,
      }),
      {},
    )
    if (isEmpty(attrParams)) {
      return []
    }
    const attrFilters = await fetchNftsFiltered(collectionAddress, attrParams)

    // Fetch market data for each token returned
    const tokenIds = Object.values(attrFilters.data).map((apiToken) => apiToken.tokenId)
    const marketData = await getNftsMarketData({ tokenId_in: tokenIds, collection: collectionAddress.toLowerCase() })

    const nftTokens: NftToken[] = Object.values(attrFilters.data).map((apiToken) => {
      const apiTokenMarketData = marketData.find((tokenMarketData) => tokenMarketData.tokenId === apiToken.tokenId)

      return {
        tokenId: apiToken.tokenId,
        name: apiToken.name,
        description: apiToken.description,
        collectionName: apiToken.collection.name,
        collectionAddress,
        image: apiToken.image,
        attributes: apiToken.attributes,
        marketData: apiTokenMarketData,
      }
    })

    return nftTokens
  } catch {
    return []
  }
})

export const fetchUserNfts = createAsyncThunk<
  NftToken[],
  { account: string; profileNftWithCollectionAddress?: TokenIdWithCollectionAddress; collections: ApiCollections }
>('nft/fetchUserNfts', async ({ account, profileNftWithCollectionAddress, collections }) => {
  const completeNftData = await getCompleteAccountNftData(account, collections, profileNftWithCollectionAddress)
  return completeNftData
})

export const updateUserNft = createAsyncThunk<
  NftToken,
  { tokenId: string; collectionAddress: string; location?: NftLocation }
>('nft/updateUserNft', async ({ tokenId, collectionAddress, location = NftLocation.WALLET }) => {
  const marketDataForNft = await getNftsMarketData({
    tokenId_in: [tokenId],
    collection: collectionAddress.toLowerCase(),
  })
  const metadataForNft = await getNftsFromDifferentCollectionsApi([{ tokenId, collectionAddress }])
  const completeNftData = { ...metadataForNft[0], location, marketData: marketDataForNft[0] }

  return completeNftData
})

export const removeUserNft = createAsyncThunk<string, { tokenId: string }>(
  'nft/removeUserNft',
  async ({ tokenId }) => tokenId,
)

export const addUserNft = createAsyncThunk<
  NftToken,
  { tokenId: string; collectionAddress: string; nftLocation?: NftLocation }
>('nft/addUserNft', async ({ tokenId, collectionAddress, nftLocation = NftLocation.WALLET }) => {
  const marketDataForNft = await getNftsMarketData({
    tokenId_in: [tokenId],
    collection: collectionAddress.toLowerCase(),
  })
  const metadataForNft = await getNftsFromDifferentCollectionsApi([{ tokenId, collectionAddress }])

  return {
    ...metadataForNft[0],
    location: nftLocation,
    marketData: marketDataForNft[0],
  }
})

export const fetchUserActivity = createAsyncThunk('nft/fetchUserActivity', async (address: string) => {
  const userActivity = await getUserActivity(address.toLocaleLowerCase())
  return userActivity
})

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {
    addAttributeFilter: (state, action: PayloadAction<{ collection: string; attribute: NftAttribute }>) => {
      if (state.data.filters[action.payload.collection]) {
        state.data.filters[action.payload.collection].activeFilters = {
          ...state.data.filters[action.payload.collection].activeFilters,
          [action.payload.attribute.traitType]: action.payload.attribute,
        }
      } else {
        state.data.filters[action.payload.collection] = {
          ...initialNftFilterState,
          activeFilters: {
            ...state.data.filters[action.payload.collection].activeFilters,
            [action.payload.attribute.traitType]: action.payload.attribute,
          },
        }
      }
    },
    removeAttributeFilter: (state, action: PayloadAction<{ collection: string; attributeKey: string }>) => {
      if (
        state.data.filters[action.payload.collection] &&
        state.data.filters[action.payload.collection].activeFilters[action.payload.attributeKey]
      ) {
        delete state.data.filters[action.payload.collection].activeFilters[action.payload.attributeKey]
      }
    },
    removeAllFilters: (state, action: PayloadAction<string>) => {
      state.data.filters[action.payload] = { ...initialNftFilterState }
      state.data.nfts[action.payload] = []
    },
    setOrdering: (state, action: PayloadAction<{ collection: string; field: string; direction: 'asc' | 'desc' }>) => {
      if (state.data.filters[action.payload.collection]) {
        state.data.filters[action.payload.collection].ordering = {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      } else {
        state.data.filters[action.payload.collection] = {
          ...initialNftFilterState,
          ordering: {
            field: action.payload.field,
            direction: action.payload.direction,
          },
        }
      }
    },
    setShowOnlyOnSale: (state, action: PayloadAction<{ collection: string; showOnlyOnSale: boolean }>) => {
      if (state.data.filters[action.payload.collection]) {
        state.data.filters[action.payload.collection].showOnlyOnSale = action.payload.showOnlyOnSale
      } else {
        state.data.filters[action.payload.collection] = {
          ...initialNftFilterState,
          showOnlyOnSale: action.payload.showOnlyOnSale,
        }
      }
    },
    resetUserNftState: (state) => {
      state.data.user = { ...initialState.data.user }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(filterNftsFromCollection.pending, (state, action) => {
      const { collectionAddress } = action.meta.arg
      if (state.data.filters[collectionAddress]) {
        state.data.filters[collectionAddress].loadingState = NftFilterLoadingState.LOADING
      } else {
        state.data.filters[collectionAddress] = {
          ...initialNftFilterState,
          loadingState: NftFilterLoadingState.LOADING,
        }
      }
    })
    builder.addCase(filterNftsFromCollection.fulfilled, (state, action) => {
      const { collectionAddress, nftFilters } = action.meta.arg

      state.data.filters[collectionAddress] = {
        ...state.data.filters[collectionAddress],
        loadingState: NftFilterLoadingState.IDLE,
        activeFilters: nftFilters,
      }
      state.data.nfts[collectionAddress] = action.payload
    })

    builder.addCase(fetchCollection.fulfilled, (state, action) => {
      state.data.collections = { ...state.data.collections, ...action.payload }
    })
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
      state.data.collections = action.payload
      state.initializationState = NFTMarketInitializationState.INITIALIZED
    })
    builder.addCase(fetchNftsFromCollections.pending, (state, action) => {
      const { collectionAddress } = action.meta.arg
      if (state.data.filters[collectionAddress]) {
        state.data.filters[collectionAddress].loadingState = NftFilterLoadingState.LOADING
      } else {
        state.data.filters[collectionAddress] = {
          ...initialNftFilterState,
          loadingState: NftFilterLoadingState.LOADING,
        }
      }
    })
    builder.addCase(fetchNftsFromCollections.fulfilled, (state, action) => {
      const { collectionAddress } = action.meta.arg
      const existingNfts: NftToken[] = state.data.nfts[collectionAddress] ?? []
      const existingNftsWithoutNewOnes = existingNfts.filter(
        (nftToken) => !action.payload.find((newToken) => newToken.tokenId === nftToken.tokenId),
      )

      state.data.filters[collectionAddress] = {
        ...state.data.filters[collectionAddress],
        loadingState: NftFilterLoadingState.IDLE,
        activeFilters: {},
      }
      state.data.nfts[collectionAddress] = [...existingNftsWithoutNewOnes, ...action.payload]
    })
    builder.addCase(fetchUserActivity.fulfilled, (state, action) => {
      state.data.user.activity = { ...action.payload, initializationState: UserNftInitializationState.INITIALIZED }
    })
    builder.addCase(fetchUserActivity.rejected, (state) => {
      state.data.user.activity.initializationState = UserNftInitializationState.ERROR
    })
    builder.addCase(fetchUserActivity.pending, (state) => {
      state.data.user.activity.initializationState = UserNftInitializationState.INITIALIZING
    })
  },
})

// Actions
export const {
  addAttributeFilter,
  removeAttributeFilter,
  removeAllFilters,
  setOrdering,
  setShowOnlyOnSale,
  resetUserNftState,
} = NftMarket.actions

export default NftMarket.reducer
