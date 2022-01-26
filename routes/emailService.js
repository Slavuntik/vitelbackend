const nodemailer=require('nodemailer')
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const settings={
    "emailSettings":{
    host:"mail.nic.ru",
    port:"465",
    auth:{
        user: 'info@vitelschool.ru', 
        pass: 'Almaz$321'
    }
}
}



class emailService {



    static async sendEmail(mailto, htmlBody, subjectHeader) {
        console.log(htmlBody)
        let transporter = nodemailer.createTransport({direct:true,
            host: settings.emailSettings.host,
            port: settings.emailSettings.port,
            auth: settings.emailSettings.auth,
            secure: true
        });
        transporter.use('compile', inlineBase64({cidPrefix: 'ticketPrefix_'}));
        let mailOptions = {
            from: settings.emailSettings.auth.user,
            to: mailto,
            subject: subjectHeader,
            html:"from:"+htmlBody.name+"<hr>"+htmlBody.from+"<hr>"+"subscribe:"+htmlBody.subscribe+"<hr><br>"+htmlBody.message,
        };
        await transporter.sendMail(mailOptions, function (error, info) {
            if(error) {
                console.log(error);
            }
            console.log("Message sent to:",mailOptions.to,info)
        });
    }
}


console.log("Email service init - ok")

module.exports=emailService