


const nodemailer    = require("nodemailer");
const jwt           =   require('jsonwebtoken');
const SECRET_KEY    =   process.env.SECRET_KEY;

async function createTransporter()
{
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
}



const sendWelcomeEmails = async (name,participants, newEvent, date_time,duration) => 
{
    const transporter = await createTransporter();
    const emailPromises = participants.map(async participant => {
        const token = jwt.sign({ email: participant.email, event_id: newEvent.event_id }, SECRET_KEY, { expiresIn: '3h' });
        const mailOptions = {
            from: `"Event Organizer" <${transporter.options.auth.user}>`,
            to: participant.email,
            subject: `Welcome to the ${name} Event!`,
            text: `Hello ${participant.name},\n\nYour participation in the event "${name}" has been confirmed!\n\nEvent Date: ${date_time}\nDuration: ${duration} minutes\n\nAccess Token: ${token}\n\nBest regards,\nEvent Organizer`
        };
        return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
};



module.exports = {createTransporter,sendWelcomeEmails};