import mailer from '../config/mailConfig.js'
import mailQueue from "../queues/mailQueue.js";

mailQueue.process(async (job) => {
    const emailData = job.data;
    console.log("Porcessing email", emailData);
    console.log("hii")
    try {
        const response = await mailer.sendMail(emailData);
        console.log("Email sent", response);
    } catch (error) {
        console.log("Mail processor error", error);
    }
})