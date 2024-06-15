import User from "../models/User";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import { Jwt } from "../utils/Jwt";

export class UserController {

    static async signup(req, res, next) {
        // const data = [{ name: 'yuvasree' }];
        // res.status(200).send(data)
        // (res as any).errorStatus = 422;
        // const error = new Error('User email or password does not match');
        // next(error);

        // res.send(req.body);

        console.log(Utils.generateVerificationToken());

        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const password = req.body.password;
        const type = req.body.type;
        const status = req.body.status;
        const verification_token = Utils.generateVerificationToken();


        // if(!email) {
        //     const error =  new Error('Email is required');
        //     next(error);
        // } 
        // else if(!password) {
        //     const error =  new Error('Password is required');
        //     next(error);
        // }
        // else if(!name) {
        //     const error =  new Error('Name is required');
        //     next(error);
        // }

        try {
            const hash = await Utils.encryptPassword(password);

            const data = {
                email,
                verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                phone,
                password: hash,
                name,
                type,
                status
            };


            let user = await new User(data).save();
            const payload = {
                aud: user._id,
                email: user.email,
                type: user.type
            };
            const token = Jwt.jwtSign(payload);

            res.json({
                token: token,
                user: user
            });

            
            // res.send(user);
            await NodeMailer.sendMail({
                to: [user.email],
                subject: 'Email Verification',
                html: `<h1>Your otp is ${verification_token}</h1>`
            });
        }
        catch (e) {
            next(e);
        }
    }

    // user.save().then((user) => {
    //     res.send(user);
    // })
    // .catch(e => {
    //     next(e);
    // });


    // static test1(req, res, next) {
    //     console.log("test");
    //     (res as any).msg = 'This is a test';
    //     next();
    // }
    // static test2(req, res) {
    //     res.send((req as any).msg);
    // }

    static async verifyUserEmailToken(req, res, next) {
        const verification_token = req.body.verification_token;
        const email = req.user.email;
        try {
            const user = await User.findOneAndUpdate(
                {
                    email: email,
                    verification_token: verification_token,
                    verification_token_time: { $gt: Date.now() }
                },
                {
                    email_verified: true,
                    updated_at: new Date()
                },
                {
                    new: true
                }
            );
            if (user) {
                res.send(user);
            }
            else {
                throw new Error('Wrong otp or Email Verification Token Is Expired. Please try again...');
            }
        }
        catch (e) {
            next(e);
        }
    }

    static async resendVerificationEmail(req, res, next) {
        // res.send(req.decoded);
        const email = req.user.email;
        const verification_token = Utils.generateVerificationToken();

        try {
            const user: any = await User.findOneAndUpdate(
                { email: email },
                {
                    updated_at: new Date(),
                    verification_token: verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                },
            );
            if (user) {
                res.json({ success: true });
                await NodeMailer.sendMail({
                    to: [user.email],
                    subject: 'Resend EMAIL Verification',
                    html: `<h1>Your otp is ${verification_token}</h1>`
                });
               res.json({success: true});
            }
            else {
                throw new Error('No User Registered with such Email');
            }
        }
        catch (e) {
            next(e);
        }
    }

    static async login(req, res, next){
        const user = req.user;
        const password = req.query.password;
        const data = {
            password,
            encrypt_password: user.password,
        };
        try {
            await Utils.comparePassword(data);
            const payload = {
                aud: user._id,
                email: user.email,
                type: user.type

            };
            const token = Jwt.jwtSign(payload);
            res.json({
                token: token,
                user: user
            });
        }
        catch(e) {
            next(e);
        }
    }
    
    static async sendResetPasswordOtp(req, res, next) {
        const email = req.query.email;
        const reset_password_token = Utils.generateVerificationToken();

        try {
            const user: any = await User.findOneAndUpdate(
                { email: email },
                {
                    updated_at: new Date(),
                    reset_password_token: reset_password_token,
                    reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                },
            );
            if (user) {
                res.json({ success: true });
                await NodeMailer.sendMail({
                    to: [user.email],
                    subject: 'Reset password email verification OTP',
                    html: `<h1>Your otp is ${reset_password_token}</h1>`
                });
                
            }
            else {
                throw new Error('No User Registered with such Email');
            }
        }
        catch (e) {
            next(e);
        }
    }

    static verifyResetPasswordToken(req, res, next) {
        res.json({ success: true}); 
    }

    static async resetPassword(req, res, next) {
        const user = req.user;
        const new_password = req.body.new_password;
        try {
            const encryptPassword = await Utils.encryptPassword(new_password);
            const UpdatedUser: any = await User.findByIdAndUpdate(
                user._id,
                {
                    updated_at: new Date(),
                    password: encryptPassword,
                },
                { new: true }
            );
            if (UpdatedUser) {
                res.send(UpdatedUser);
            }
            else {
                throw new Error('User doesn\'t exist');
            }
        }
        catch (e) {
            next(e);
        }

    }

    static async profile(req, res, next) {
        const user = req.user;
        try {
            const profile: any = await User.findById(user.aud);
            if (profile) {
                res.send(profile);
            }
            else {
                throw new Error('User doesn\'t exist');
            }
        }
        catch (e) {
            next(e);
        }

    }

    static async updatePhoneNumber(req, res, next) {
        const user = req.user;
        const phone = req.body.phone;
        try {
            const userData = await User.findByIdAndUpdate(
                user.aud,
                { phone: phone, updated_at: new Date() },
                { new: true }
            );
            res.send(userData);
        }
        catch(e) {
            next(e);
        }
    }


    static async updateUserProfile(req, res, next) {
        const user = req.user;
        const phone = req.body.phone;
        const new_email = req.body.email;
        const plain_password = req.body.password;
        const verification_token = Utils.generateVerificationToken();


        try {
            const userData = await User.findById(user.aud);
            if(!userData) throw new Error('User Doesn\'t exists');
            await Utils.comparePassword({
                password: plain_password,
                encrypt_password: userData.password
            });
            const updatedUser = await User.findByIdAndUpdate(
                user.aud,
                {
                    phone: phone,
                    email: new_email,
                    email_verified: false,
                    verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                    updated_at: new Date()
                },
                { new: true }
            );
            const payload = {
                aud: user.aud,
                email: updatedUser.email,
                type: updatedUser.type

            };
            const token = Jwt.jwtSign(payload);

            res.json({
                token: token,
                user: updatedUser
            });
            // res.send(user);
            await NodeMailer.sendMail({
                to: [updatedUser.email],
                subject: 'Updated Email Verification',
                html: `<h1>Your otp is ${verification_token}</h1>`
            });

        }
        catch(e) {
            next(e);
        }
    }

}

