import { Interface } from "readline";
import { DevEnvironment } from "./environments_dev";
import { ProdEnvironment } from "./environments_prod";

export interface Environment {
    db_uri: string,
    jwt_secret_key: string,
    testMail: {
        api_key?: string,
        email_from?: string,
    },
    mail_auth?: {
        user: string,
        pass: string
    }
}

export function getEnvironmentVariables() {
    if(process.env.NODE_ENV === 'production') {
        return ProdEnvironment;
    }
    return DevEnvironment;

}