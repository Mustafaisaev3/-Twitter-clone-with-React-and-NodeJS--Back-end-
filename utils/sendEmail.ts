import mailer from '../core/mailer'
import { SentMessageInfo } from "nodemailer";

interface SendEmailProps {
    emailFrom: string,
    emailTo: string,
    subject: string,
    html: string,
}

export const sendEmail = ({ emailFrom, emailTo, subject, html }: SendEmailProps, callback?: (err: Error | null, info: SentMessageInfo) => void) => {
    mailer.sendMail(
        {
            from: emailFrom,
            to: emailTo,
            subject: subject,
            html: html,
        },
        callback || function (err: Error | null, info: SentMessageInfo){
            if (err) {
                console.log(err)
            } else {
                console.log(info)
            }
        }
    )
}

// mailer.sendMail(
//     {
//         from: 'admin@twitter.com',
//         to: data.email,
//         subject: 'Подтверждение почты Twitter',
//         html: `Для того, чтобы подтвердить почту, перейлите <a href='http://localhost:${process.env.PORT || 8888}/signup/verify?hash=${data.confirmHash}' по этой ссылке </a>`,
//     },
//     function (err: Error | null, info: SentMessageInfo){
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(info)
//         }
//     }
// )