import { APP_LINK, MAIL_ID } from "../../config/serverConfig.js";

export const workspaceJoinMail = function(workspace) {
    return {
        to: MAIL_ID,
        subject: 'You have been added to workspace',
        text: `Congratulations! you have been added to the workspace ${workspace.name}`
    }
}

export const verificationEmail = function (verificationToken) {
    return {
        from: MAIL_ID,
        subject: 'Welcome to the app. Please verify your email',
        text: `Welcome to the app. Please verify your email by clicking on the link below: ${APP_LINK}/verify/${verificationToken}`
    }
}