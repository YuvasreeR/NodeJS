import { error } from 'console';
import { promises } from 'dns';
import * as express from 'express';
import { resolve } from 'path';
import * as mongoose from 'mongoose';
import { getEnvironmentVariables } from './environments/environment';
import UserRouter from './routers/UserRouter';
import * as bodyParser from 'body-parser'; 
import * as cors from 'cors';
import BannerRouter from './routers/BannerRouter';
import CityRouter from './routers/CityRouter';
import RestaurantRouter from './routers/RestaurantRouter';
import CategoryRouter from './routers/CategoryRouter';
import ItemRouter from './routers/ItemRouter';
import AddressRouter from './routers/AddressRouter';
import OrderRouter from './routers/OrderRouter';
import * as dotenv from 'dotenv';

export class Server {

    public app: express.Application = express();


    constructor() {
        this.setConfigs();
        this.setRoutes();
        this.error404Handler();
        this.HandleErrors();
    }

    setConfigs() {
        this.dotenvConfigs();
        this.connectMongoDB();
        this.allowCors();
        this.configureBodyParser();
       
    }

    dotenvConfigs() {
        dotenv.config({ path: '/.env' });
    }

    connectMongoDB() {
        mongoose.connect(getEnvironmentVariables().db_uri)
            .then(() => {
                console.log('Connected to mongodb');
            });
    }

    configureBodyParser(){
        this.app.use(bodyParser.urlencoded({
            extended: true
    }));
    }

    allowCors() {
        this.app.use(cors());
    }

    setRoutes() {
        this.app.use('src/uploads', express.static('src/uploads'));
        this.app.use('/api/user', UserRouter);   
        this.app.use('/api/banner', BannerRouter);   
        this.app.use('/api/city', CityRouter);   
        this.app.use('/api/restaurant', RestaurantRouter);   
        this.app.use('/api/category', CategoryRouter);   
        this.app.use('/api/item', ItemRouter);   
        this.app.use('/api/address', AddressRouter);   
        this.app.use('/api/order', OrderRouter);   
    }

    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: "Not found",
                status_code: 404
            });
        });
    }

    
    HandleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'Something went wrong. Please try again.',
                status_code: errorStatus
            });
        });
    }
}