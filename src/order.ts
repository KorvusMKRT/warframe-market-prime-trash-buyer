import { User } from "./order-users"
export interface Order {
  quantity: number
  visible: boolean
  order_type: string
  platinum: number
  user: User
  platform: string
  creation_date: string
  last_update: string
  id: string
  region: string
}

