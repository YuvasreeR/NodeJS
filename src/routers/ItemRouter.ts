
import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { Utils } from "../utils/Utils";
import { ItemController } from "../controllers/ItemController";
import { ItemValidators } from "../validators/ItemValidators";

class ItemRouter {
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
        this.router.get('/menuItems/:restaurantId', GlobalMiddleware.auth, ItemValidators.getMenuItems(), GlobalMiddleware.checkError, ItemController.getMenu);

    }   

    postRoutes() { 
        this.router.post('/create', GlobalMiddleware.auth, GlobalMiddleware.adminRole , new Utils().multer.single('itemImages'), ItemValidators.addItem(), GlobalMiddleware.checkError, ItemController.addItem ); 
    }
    patchRoutes() { 
        
    }
    putRoutes() { }
    deleteRoutes() { }
}

export default new ItemRouter().router;