import { useState } from 'react'

/**
 * Fetch top addresses by volume
 */
const useTopTokenAddresses = (): string[] => {
  const [topTokenAddresses, ] = useState([])
  return topTokenAddresses
}

export default useTopTokenAddresses
