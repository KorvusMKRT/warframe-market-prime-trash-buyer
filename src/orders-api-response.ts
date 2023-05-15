import { Order } from "./order"
export interface OrdersApiResponce{
    payload:{
        orders:Array<Order>
    }
}