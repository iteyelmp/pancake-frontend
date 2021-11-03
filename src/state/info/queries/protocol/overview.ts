import { useState, } from 'react'
import { ProtocolData } from 'state/info/types'


interface ProtocolFetchState {
  error: boolean
  data?: ProtocolData
}

const useFetchProtocolData = (): ProtocolFetchState => {
  const [fetchState, ] = useState<ProtocolFetchState>({
    error: false,
  })
  return fetchState
}

export default useFetchProtocolData
