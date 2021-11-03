import { getUnixTime } from 'date-fns'
import { PriceChartEntry } from 'state/info/types'

const fetchTokenPriceData = async (
  address: string,
  interval: number,
  startTimestamp: number,
): Promise<{
  data?: PriceChartEntry[]
  error: boolean
}> => {
  // Construct timestamps to query against
  const endTimestamp = getUnixTime(new Date())
  const timestamps = []
  let time = startTimestamp
  while (time <= endTimestamp) {
    timestamps.push(time)
    time += interval
  }
  return {
    error: true,
  }
}

export default fetchTokenPriceData
