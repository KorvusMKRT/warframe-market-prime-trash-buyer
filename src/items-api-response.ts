import {Item} from "./item"

export interface ItemsApiResponse{
    payload:{
        items:Array<Item>
    }
}
