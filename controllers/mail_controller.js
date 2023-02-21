const nodemailer = require('nodemailer');

async function sendMail(req,res,next){
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'developer.pratham@gmail.com',
                pass: 'mdhmkurvnyqbtegb'
            }
        });
        const mailOptions = {
            from: 'developer.pratham@gmail.com',
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.message,
        };

        const info  = await transporter.sendMail(mailOptions);
        const rejected=info.rejected;
        if(rejected.length>0){
            res.status(400).json({
                status:"error",
                message:'Emails not properly formatted',
                data:rejected,
            });
        }else{
            res.status(200).json({
                status:"success",
                message:"Mail sent successfully",
                data:info,
            });
        }
    }catch (e) {
        next(e);
    }
}


module.exports = {sendMail};