import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js"
import clientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getMessageService = async (
    messageParams, 
    page, 
    limit,
    user
) => {

    const channelDetails = await channelRepository.getChannelWithWorkspaceDetails(
        messageParams.channelId
    );

    const workspace = channelDetails.workspaceId;

    const isMember = isUserMemberOfWorkspace(workspace, user);
    if(!isMember){
        throw new clientError({
            explanation: 'User is not member of workspace',
            message: 'User is not member of workspace',
            statusCode: StatusCodes.UNAUTHORIZED
        });
    }

    const message = await messageRepository.getPaginatedMessaged(
        messageParams, 
        page, 
        limit    
    );
    return message;
}

export const createMessageService = async (message) => {
    const newMessage = await messageRepository.create(message);
    return newMessage;
}