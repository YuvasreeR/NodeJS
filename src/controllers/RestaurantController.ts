import Category from "../models/Category";
import Restaurant from "../models/Restaurant";
import User from "../models/User";
import { Utils } from "../utils/Utils";

export class RestaurantController {

    static async addRestaurant(req, res, next) {
        const restaurant = req.body;
        const path = req.file.path;
        const verification_token = Utils.generateVerificationToken();


        try {
            // Create restaurant user
            const hash = await Utils.encryptPassword(restaurant.password);

            const data = {
                email: restaurant.email,
                verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                phone: restaurant.phone,
                password: hash,
                name: restaurant.name,
                type: 'restaurant',
                status: 'active',
            };
            const user = await new User(data).save();

            // Create restaurant
            let restaurant_data: any = {
                name: restaurant.res_name,
                // short_name: restaurant.short_name,
                location: JSON.parse(restaurant.location),
                address: restaurant.address,
                openTime: restaurant.openTime,
                closeTime: restaurant.closeTime,
                status: restaurant.status,
                cuisines: JSON.parse(restaurant.cuisines),
                price: parseInt(restaurant.price),
                delivery_time: parseInt(restaurant.delivery_time),
                city_id: restaurant.city_id,
                user_id: user._id,
                cover: path

            };
            if(restaurant.description) restaurant_data = {...restaurant_data, description: restaurant.description};
            const restaurantDoc = await new Restaurant(restaurant_data).save();
           

             // Create categories
             const categoriesData = JSON.parse(restaurant.categories).map(x => {
                return {name: x, restaurant_id: restaurantDoc._id};
            });
            const categories = Category.insertMany(categoriesData);

            res.send(restaurantDoc)
        }
        catch(e) {
            next(e);
        }
    }

    
    static async getNearbyRestaurants(req, res, next) {
        const EARTH_RADIUS_IN_KM = 6378.1;
        const data = req.query;
        try {
        
            const restaurants = await Restaurant.find({
                status: 'active',
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [ parseFloat(data.lng), parseFloat(data.lat)],
                            parseFloat(data.radius) / EARTH_RADIUS_IN_KM
                        ]
                    }
                }
            });

            res.send(restaurants);
        } catch (e) {
            console.log(e.message);
            next(e);
        }
    }


    static async searchNearbyRestaurants(req, res, next) {
        const EARTH_RADIUS_IN_KM = 6378.1;
        const data = req.query;
        try {
        
            const restaurants = await Restaurant.find({
                status: 'active',
                name: { $regex: data.name, $options: 'i' },
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [ parseFloat(data.lng), parseFloat(data.lat)],
                            parseFloat(data.radius) / EARTH_RADIUS_IN_KM
                        ]
                    }
                }
            });

            res.send(restaurants);
        } catch (e) {
            console.log(e.message);
            next(e);
        }
    } 
    
    static async getRestaurants(req, res, next) {

            try {
        
                const restaurants = await Restaurant.find({
                    status: 'active',
                });
    
                res.send(restaurants);
            } catch (e) {
                console.log(e.message);
                next(e);
            }
        }
    

}