import { body, param } from "express-validator";
import Restaurant from "../models/Restaurant";
import Category from "../models/Category";

export class ItemValidators {

    static addItem() {
        return [
            body('ItemImages', 'Cover image is required')
            .custom((cover, {req}) => {
                if(req.file) {
                    return true;
                }
                else {
                    throw('File not uploaded');
                }
            }),
            body('name', 'Item Name is required').isString(),
            body('restaurant_id', 'Restaurant Id is required').isString()
            .custom((restaurant_id, {req}) => {
                return Restaurant.findById(restaurant_id)
                .then(restaurant => {
                    if(restaurant) {
                        return true;
                    }
                    else {
                        throw('Restaurant Does not Exists');
                    }
                }).catch(e => {
                    throw (e);
                })
            }),
            body('category_id', 'Category Id is required').isString()
            .custom((category_id, {req}) => {
                return Category.findOne({_id: category_id, restaurant_id: req.body.restaurant_id})
                .then(Category => {
                    if(Category) {
                        return true;
                    }
                    else {
                        throw('Category Does not Exists');
                    }
                }).catch(e => {
                    throw (e);
                })
            }),
            body('status', 'Status is required').isBoolean(),
            body('price', 'Price is required').isString(),
            body('veg', 'Item is veg or not is required').isBoolean(),

        ];
    }


    static getMenuItems() {
        return [
            param('restaurantId', 'Restaurant Id is required').isString()
            .custom((restaurant_id, {req}) => {
                return Restaurant.findById(restaurant_id)
                .then(restaurant => {
                    if(restaurant) {
                      req.restaurant = restaurant;
                    }
                    else {
                        throw('Restaurant Does not Exists');
                    }
                }).catch(e => {
                    throw (e);
                })
            }),
            
            
        ];
    }


}