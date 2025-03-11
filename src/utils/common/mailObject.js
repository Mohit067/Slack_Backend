import { MAIL_ID } from "../../config/serverConfig.js";

export const workspaceJoinMail = function(workspace) {
    return {
        to: MAIL_ID,
        subject: 'You have been added to workspace',
        text: `Congratulations! you have been added to the workspace ${workspace.name}`
    }
}