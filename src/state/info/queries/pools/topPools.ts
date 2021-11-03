import { useState } from 'react'
/**
 * Fetch top addresses by volume
 */
const useTopPoolAddresses = (): string[] => {
  const [topPoolAddresses, ] = useState([])
  return topPoolAddresses
}

export default useTopPoolAddresses
