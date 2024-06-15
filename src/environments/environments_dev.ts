import { Environment } from "./environment";

export const DevEnvironment: Environment = {
    db_uri: 'mongodb+srv://yuvasree:yuva@cluster0.xhsvhpp.mongodb.net/CloneApp?retryWrites=true&w=majority&appName=Cluster0',
    jwt_secret_key: 'secret_key',
    testMail: {
        api_key: '547ff1fd-8d0f-45b7-8f26-e221ddb60c88',
        email_from: 'yuvasreeravi1002@gmail.com',
    },
    mail_auth: {
        user: 'bc9a64314d09c5',
        pass: 'f7efdee09f84bc',
    },
    
};