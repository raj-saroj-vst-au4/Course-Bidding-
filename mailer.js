const nodemailer = require('nodemailer');

const username = "userid"
const password = "password"

const email = {}

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: username,
        pass: password
    }
})

email.sendConfirmation = (student, token) => {
    console.log("sending email to " + student.nstudent_email)
    smtpTransport.sendMail({
            to: student.nstudent_email,
            subject: 'Email Confirmation for Course Bidding Portal',
            html: `<h1>Hello ${ student.nstudent_fname }, Please Click on the following link to verify your account to access course bidding portal: </h1><br><a href=http://192.168.0.158:8008/api/verifyRegistration/${token}>Click to Verify</a>`
            },(err, info)=>{
                if(err){
                    return console.log(err)
                }else{
                    return console.log(`Email confirmation sent to ${student.nstudent_email}`)
                }
            })
}


email.sendPassReset = (student, token) => {
    smtpTransport.sendMail({
        to: student.nstudent_email,
            subject: 'Password Reset Link for Course Bidding Portal',
            html: `<h1>Hello ${student.student_name}, Please Click on the following link to reset your account password to access course bidding portal: </h1><br><a href=http://192.168.0.158:8008/api/verifyPassReset/${token}>Click to Verify</a>`
        },(err, info)=>{
            if(err){
                return console.log(err)
            }else{
                return console.log(`Email confirmation sent to ${student.nstudent_email}`)
            }
        })
}

module.exports = email;
