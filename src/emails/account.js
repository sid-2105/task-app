const sgmail = require('@sendgrid/mail')

sgmail.setApiKey(process.env.SG_API_KEY)

// sgmail.send({
//     to:'siddhuji0509@gmail.com',
//     from:'siddhuji0509@gmail.com',
//     subject:'this is first email',
//     text:'successfully implemented'

// })

const sendWelcomeEmail = (email,name)=>{
    sgmail.send({
        to:email,
        from:'siddhuji0509@gmail.com',
        subject:'Thanks for joining TaskBuddy',
        text:'Welcome to the app, ${name}.Let me know how you get along with the app.'
    })
}

const sendCancelationEmail = (email,name)=>{
    sgmail.send({
        to:email,
        from:'siddhuji0509@gmail.com',
        subject:'Sad to see u going from TaskBuddy',
        text:'Goodbye , ${name}.Sad to see u going from the taskbuddy.'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}