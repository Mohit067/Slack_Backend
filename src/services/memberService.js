import { StatusCodes } from "http-status-codes";
import workspaceRepository from "../repositories/workspaceRepository.js"
import clientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";
import userRepository from "../repositories/userRepository.js";

export const isMemberAlreadyPartOfWorkspaceService = async (
    workspaceId,
    memeberId
) => {
    const workspace = await workspaceRepository.getById(workspaceId);
    if(!workspace){
        throw new clientError({
            explanation: 'wokspace not found',
            message: 'workspace not found',
            statusCode: StatusCodes.NOT_FOUND
        });
    }

    const isUserAMember = isUserMemberOfWorkspace(workspace, memeberId);

    if(!isUserAMember){
        throw new clientError({
            explanation: 'User is not member of workspace',
            message: 'User is not member of workspace',
            statusCode: StatusCodes.UNAUTHORIZED
        })
    }

    const user = await userRepository.getById(memeberId);
    return user;
}