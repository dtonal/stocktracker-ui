export interface Portfolio {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface PortfolioCreateRequest {
  name: string
  description: string
}
