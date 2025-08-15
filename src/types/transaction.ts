import type { Stock } from './stock'

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface StockTransaction {
  id: string
  stock: Stock
  transactionDate: string // ISO-8601 Datums-String
  quantity: number
  pricePerShare: number
  transactionType: TransactionType
  createdAt: string // ISO-8601 Datums-String
  updatedAt: string // ISO-8601 Datums-String
}

export interface NewTransactionData {
  type: TransactionType
  ticker: string
  quantity: number
  price: number
  date: string
}
