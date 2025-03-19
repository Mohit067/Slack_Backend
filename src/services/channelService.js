import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import clientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelById = async (channelId, userId) => {
    try {
        const channel = await channelRepository.getChannelWithWorkspaceDetails(channelId);
        console.log("this is channel::::::::::", channel);
        console.log(channel.workspaceId);
        console.log(channel)
        if( !channel || !channel.workspaceId ){
            throw new clientError({
                explanation: "channel not found with this ID",
                message: "channel not found",
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        const isMemberPartOfWorkspace = isUserMemberOfWorkspace(
            channel.workspaceId,
            userId
        );
        if(!isMemberPartOfWorkspace){
            throw new clientError({
                explanation: "User is not member of this channel",
                message: "User is not member of this channel",
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const message = await messageRepository.getPaginatedMessaged(
            {
                channelId
            },  
            1,
            20
        )
        
        return {
            message,
            _id: channel._id,
            name: channel.name,
            createAt: channel.createdAt,
            updateAt: channel.updatedAt,
            workspaceId: channel.workspaceId
        }
    } catch (error) {
        console.log("Getting channel by id error", error);
        throw error;

    }
}