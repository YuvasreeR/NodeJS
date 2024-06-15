import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { OrderValidators } from "../validators/OrderValidators";
import { OrderController } from "../controllers/OrderController";

class OrderRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        this.router.get('/user', GlobalMiddleware.auth, OrderController.getUserOrder);


    }   

    postRoutes() { 
        this.router.post('', GlobalMiddleware.auth, OrderValidators.placeOrder(), GlobalMiddleware.checkError, OrderController.placeOrder ); 
    }
    patchRoutes() { 

    }
    putRoutes() { 
    }

    deleteRoutes() { 

    }
}

export default new OrderRouter().router;