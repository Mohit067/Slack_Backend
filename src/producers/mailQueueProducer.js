import '../processors/mailProcessor.js';

import mailQueue from "../queues/mailQueue.js";

export const addEmailToMailQueue = (emailData) => {
    console.log('email sending processs');
    try {
        mailQueue.add(emailData);
        console.log("Email added to mail queue");
    } catch (error) {
        console.log("Add email to mail queue error", error);
    }
}