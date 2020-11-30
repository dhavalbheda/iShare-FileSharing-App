const nodemailer = require('nodemailer')
const keys = require('../config/keys')

const sendMail = async ({from, subject, to, html, text=null}) => {
    let transporter = nodemailer.createTransport({
        service: keys.SMTP_SERVICE,
        auth: {
        user: keys.SMTP_USER,
        pass: keys.SMTP_PASSWORD
    }
    })

    let info = await transporter.sendMail({
                            from,
                            to,
                            subject,
                            html,
                            text
                        })
    if(info.accepted)
      return true;
    else
      return false;
}
module.exports = sendMail