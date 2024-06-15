import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";

class UserRouter {
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
        this.router.get('/send/verification/email', GlobalMiddleware.auth, UserController.resendVerificationEmail);
        this.router.get('/login', UserValidators.login(), GlobalMiddleware.checkError, UserController.login);
        this.router.get('/send/reset/password/token', UserValidators.checkResetPasswordEmail(), GlobalMiddleware.checkError, UserController.sendResetPasswordOtp);
        this.router.get('/verify/resetPasswordToken', UserValidators.verifyResetPasswordToken(), GlobalMiddleware.checkError, UserController.verifyUserEmailToken);
        this.router.get('/profile', GlobalMiddleware.auth, UserController.profile);
    }   

    postRoutes() { 
        this.router.post('/signup', UserValidators.signup(), GlobalMiddleware.checkError,UserController.signup); 

    }
    patchRoutes() { 
        this.router.patch('/reset/password', UserValidators.resetPassword(), GlobalMiddleware.checkError, UserController.resetPassword); 
        this.router.patch('/verify/emailToken', GlobalMiddleware.auth, UserValidators.verifyUserEmailToken(), GlobalMiddleware.checkError,UserController.verifyUserEmailToken); 
        this.router.patch('/update/phone', GlobalMiddleware.auth, UserValidators.verifyPhoneNumber(), GlobalMiddleware.checkError,UserController.updatePhoneNumber); 
        this.router.patch('/update/profile', GlobalMiddleware.auth, UserValidators.verifyUserProfile(), GlobalMiddleware.checkError,UserController.updateUserProfile); 
    }
    putRoutes() { }
    deleteRoutes() { }
}

export default new UserRouter().router;