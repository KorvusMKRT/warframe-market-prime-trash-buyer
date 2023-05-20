import axios from "axios";
import { ItemsApiResponse } from "./items-api-response";
import { OrdersApiResponce } from "./orders-api-response";
import { Order } from "./order";
import { error } from "console";
import { ITEM_NAMES_TO_BUY } from "./item-names-to-buy";
const { program } = require('commander');

main();
async function main() {
    program
        .option('-i, --items [items...]', 'specify item')
        .option('-q, --quant [quantity...]', 'specify quantity of items')
        .option('-p, --platinum [platinum...]', 'specify number of platinum')
    program.parse();
    let options = program.opts();
    if (options.items !== undefined && !Array.isArray(options.items)) {
        throw new Error(`Items is not an array`)
    };
    let customItems = options.items ?? ITEM_NAMES_TO_BUY;
    console.log('Options: ', options);
    console.log('Remaining arguments: ', program.args);
    let result = await axios.get<ItemsApiResponse>('https://api.warframe.market/v1/items');
    let allItems = result.data.payload.items
    let itemsToBuy = allItems.filter((item) => {
        return customItems.includes(item.item_name);
    });
    let allOrders: Array<Order> = [];
    for (const itemToBuy of itemsToBuy) {
        let ordersApiResponse = await axios.get<OrdersApiResponce>(`https://api.warframe.market/v1/items/${itemToBuy.url_name}/orders`);
        let resultOrders = ordersApiResponse.data.payload.orders;
        resultOrders = resultOrders.map((order) => {
            return {
                ...order,
                item: itemToBuy
            }
        })
        allOrders = [...allOrders, ...resultOrders]
    }
    let customQuantity = options.quant ?? 3;
    let customPlatinum = options.platinum ?? 4;
    let coolOrders: Array<Order> = allOrders.filter((coolOrder) => {
        return (
            coolOrder.quantity >= customQuantity &&
            coolOrder.platinum <= customPlatinum &&
            coolOrder.user.status === 'ingame' &&
            coolOrder.order_type === 'sell'
        );
    })

    let sortedOrders = coolOrders.sort((order1, order2) => {
        return order1.user.id.localeCompare(order2.user.id);
    });

    let messages = sortedOrders.map((order) => {
        let sum = Math.min(customPlatinum, order.platinum, 3);
        return `/w ${order.user.ingame_name} Hello! You have WTS order: ${order.item!.item_name} for ${order.platinum}. I would like to buy all ${order.quantity} for ${Math.min(3, order.platinum) * order.quantity} if you are interested :)`
    })

    console.log(messages)
}