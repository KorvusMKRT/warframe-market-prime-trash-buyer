import axios from "axios";
import { ItemsApiResponse } from "./items-api-response";
import { OrdersApiResponce } from "./orders-api-response";
import { ITEM_NAMES_TO_BUY } from "./item-names-to-buy";
import { Order } from "./order";
main();
async function main() {
    let result = await axios.get<ItemsApiResponse>('https://api.warframe.market/v1/items');
    let allItems = result.data.payload.items

    let itemsToBuy = allItems.filter((item) => {
        return ITEM_NAMES_TO_BUY.includes(item.item_name);
    });

    let firstElement = itemsToBuy[0];
    firstElement.url_name
    let allOrders: Array<Order> = [];;
    for (const itemToBuy of itemsToBuy) {
        let ordersApiResponse = await axios.get<OrdersApiResponce>(`https://api.warframe.market/v1/items/${itemToBuy.url_name}/orders`);
        let resultOrders = ordersApiResponse.data.payload.orders;
        allOrders = [...allOrders, ...resultOrders]
    }

    console.log(allOrders);

}