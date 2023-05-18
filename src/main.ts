import axios from "axios";
import { ItemsApiResponse } from "./items-api-response";
import { OrdersApiResponce } from "./orders-api-response";
import { Order } from "./order";
const { program } = require('commander');

main();
async function main() {
    program
  .option('-i, --items <items...>','specify item')
  program.parse();
  let options = program.opts();
console.log('Options: ', options);
console.log('Remaining arguments: ', program.args);
    let result = await axios.get<ItemsApiResponse>('https://api.warframe.market/v1/items');
    let allItems = result.data.payload.items
    let itemsToBuy = allItems.filter((item) => {
        return options.items.includes(item.item_name);
    });
    let allOrders: Array<Order> = [];
    for (const itemToBuy of itemsToBuy) {
        let ordersApiResponse = await axios.get<OrdersApiResponce>(`https://api.warframe.market/v1/items/${itemToBuy.url_name}/orders`);
        let resultOrders = ordersApiResponse.data.payload.orders;
        resultOrders = resultOrders.map( (order) => {
            return {
                ...order,
                item:itemToBuy
            }
        })
        allOrders = [...allOrders, ...resultOrders]
    }
let coolOrders: Array<Order> = allOrders.filter ((coolOrder) =>{
    return (coolOrder.platinum < 4 && coolOrder.quantity > 2 && coolOrder.user.status === 'ingame'&& coolOrder.order_type === 'sell');
})


let sortedOrders =  coolOrders.sort( (order1 , order2) =>{
        return order1.user.id.localeCompare(order2.user.id);
      });

     let messages = sortedOrders.map ((order) => {
        let sum = Math.min(order.platinum , 3);
        return `/w ${order.user.ingame_name} Hello! You have WTS order: ${order.item!.item_name} for ${order.platinum}. I would like to buy all ${order.quantity} for ${Math.min(3, order.platinum)*order.quantity} if you are interested :)`
     })

console.log(messages)






}