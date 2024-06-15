import { body } from "express-validator";

export class BannerValidators {

    static addBanner() {
        return [
            body('bannerimages', 'Banner is required')
            .custom((banner, {req}) => {
                if(req.file) {
                    return true;
                }
                else {
                    throw('File not uploaded');
                }
            }),
        ];
    }

}