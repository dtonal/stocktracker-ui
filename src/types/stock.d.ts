export interface Stock {
  id: string
  symbol: string
  name: string
  exchange?: string
  currency: string
  createdAt: string
  updatedAt: string
}

export interface StockSearchItem {
  symbol: string
  description: string
  displaySymbol: string
  type: string
  isSavedInDb: boolean
}

export interface StockSearchResult {
  count: number
  result: StockSearchItem[]
}
