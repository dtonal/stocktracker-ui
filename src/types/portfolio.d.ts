export interface Portfolio {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  userId: string
  transactions: StockTransaction[]
}

export interface PortfolioCreateRequest {
  name: string
  description: string
}
