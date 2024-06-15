import * as nodeMailer from 'nodemailer';
// import * as testMail from 'testmail';
// import * as SendGrid from 'nodemailer-sendgrid-transport';
import { getEnvironmentVariables } from '../environments/environment';


export class NodeMailer {
    private static initiateTransport() {
        console.log(getEnvironmentVariables().testMail.api_key);
        return nodeMailer.createTransport(
        //     testMail({
        //         auth: {
        //             api_key: getEnvironmentVariables().testMail.api_key,
        //         }
                
        //     })
            
            { 
                service: 'mailtrap',
                auth: {
                    user: getEnvironmentVariables().mail_auth.user,
                    pass: getEnvironmentVariables().mail_auth.pass,
                }
            }
        );
       
    }

    static sendMail(data: {to: [string], subject: string, html: string}): Promise<any> {
        console.log(data.to, data.html, data.subject);
        return NodeMailer.initiateTransport().sendMail({
            // from: getEnvironmentVariables().gmail_auth.user,
            from: getEnvironmentVariables().testMail.email_from,
            to: data.to,
            subject: data.subject,
            html: data.html
        });
    }
}