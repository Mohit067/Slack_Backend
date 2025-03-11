import { StatusCodes } from 'http-status-codes';
import mongoose from "mongoose";
import { v4 as uuidv4} from 'uuid';

import { addEmailToMailQueue } from '../producers/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js";
import { workspaceJoinMail } from '../utils/common/mailObject.js';
import clientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const isUserAdminOfWorkspace = (workspace, userId) => {
    return workspace.members.some((member) => {
        const memberIdStr = member.memberId?._id
            ? member.memberId._id.toString()  // If memberId is an object
            : member.memberId.toString();    // If memberId is a string

        return memberIdStr === userId.toString() && member.role === "admin";
    });
};


export const isUserMemberOfWorkspace = (workspace, userId) => {
    if (!workspace || !workspace.members) {
        console.error("Workspace or members are undefined:", workspace);
        return false;
    }
    
    return workspace.members.find((member) => member.memberId.toString() === userId.toString());
};

export const isChannelIsAlreadyPartOfWorkspace = (workspace, channelName) => {
    if (!workspace?.channels || !Array.isArray(workspace.channels)) {
        return false; // No channels exist
    }

    console.log("Checking channel names in workspace:", workspace.channels.map(c => c.name)); // Debugging log

    return workspace.channels.some(
        (channel) => channel?.name?.toLowerCase() === channelName.toLowerCase()
    );
};


export const createWorkspaceService = async (worksapceData) => {
    try {
        const joinCode = uuidv4().substring(0, 6).toUpperCase();  

        const response = await workspaceRepository.create({
            name: worksapceData.name,
            description: worksapceData.description,
            joinCode
        });

        await workspaceRepository.addMemberToWorkspace(
            response._id,
            worksapceData.owner,
            'admin'
        );

        const updateWorkspace = await workspaceRepository.addChannelToWorkspace(
            response._id,
            'general'
        );
        return updateWorkspace;
    } catch (error) {
        console.log("create workspace service error", error);
        if(error.name === 'ValidationError'){
            throw new ValidationError(
                {
                    error: error.errors
                }, 
                error.message
            );
        }
        console.log("name of error :::::::::", error.name);
        if(error.name === "MongoServerError"){
            console.log("Custom error response sdfsdfsdfsdfs:", error);
            
            throw new ValidationError(
                {
                    error: ['A workspace with the same detail already exists']
                }, 
                'A workspace with the same detail already exists'
            );
        }
    }
};

export const getWorkspacesUserIsMemberOfService = async (userId) => {
    try {
        const response = await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
        return response;
    } catch (error) {
        console.log("create workspace service error", error);
        throw error;
    }
}

export const deleteWorkspaceService = async (workspaceId, userId) => {
    try {
        console.log("Received workspaceId:", workspaceId);
        console.log("Received userId:", userId);

        // ✅ Validate workspaceId before querying
        if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
            throw new clientError({
                explanation: "Invalid workspace ID",
                message: "Workspace ID is not valid",
                statusCodes: StatusCodes.BAD_REQUEST,
            });
        }

        const workspace = await workspaceRepository.getById(workspaceId);
        console.log("Deleting workspace with ID:", workspaceId);
        console.log("Workspace data ::::::: ", workspace);

        if (!workspace) {
            throw new clientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCodes: StatusCodes.NOT_FOUND,
            });
        }

        console.log("Members in workspace:", workspace.members);

        if (!workspace.members || workspace.members.length === 0) {
            throw new clientError({
                explanation: "Workspace has no members",
                message: "No members found in workspace",
                statusCodes: StatusCodes.BAD_REQUEST,
            });
        }

        console.log("Checking if user is an admin...");

        const isAllowed = isUserAdminOfWorkspace(workspace, userId);

        console.log("isAllowed value:", isAllowed);

        if (isAllowed) {
            await channelRepository.deleteMany(workspace.channels);
            const response = await workspaceRepository.delete(workspaceId);
            console.log("Workspace deleted successfully:", response);
            return response;
        }

        throw new clientError({
            explanation: "User is either not a member or not an admin for this workspace",
            message: "User not allowed to delete the workspace",
            statusCodes: StatusCodes.UNAUTHORIZED,
        });

    } catch (error) {
        console.log("Error occurred while deleting workspace:", error);
        throw error;
    }
};

export const getWorkspaceService = async (workspaceId, userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        console.log("this is workspace :::  ;;; ", workspace);
        if(!workspace){
            throw new clientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCodes: StatusCodes.NOT_FOUND,
            });
        }

        const isMember = isUserMemberOfWorkspace(workspace, userId);
        console.log("this is memeber :::::::: ", isMember);
        if(!isMember){
            throw new clientError({
                explanation: "User is  not a member of the workspace",
                message: "User is  not a member of the workspace",
                statusCodes: StatusCodes.UNAUTHORIZED,
            });
        }
        return workspace;
    } catch (error) {
        console.log("get workspace error", error);
        throw error;
    }
}

export const getWorkspaceByjoinCodeService = async (joinCode, userId) => {
    try {
        const workspace = await workspaceRepository.getWorkspaceByjoinCode(joinCode);
        if(!workspace){
            throw new clientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCodes: StatusCodes.NOT_FOUND,
            });
        }
        const isMember = isUserMemberOfWorkspace(workspace, userId);
        console.log("this is memeber :::::::: ", isMember);
        if(!isMember){
            throw new clientError({
                explanation: "User is  not a member of the workspace",
                message: "User is  not a member of the workspace",
                statusCodes: StatusCodes.UNAUTHORIZED,
            });
        }
        return workspace;
    } catch (error) {
        console.log("get workspace by join code error", error);
        throw error;
    }
}

export const updateWorkspaceService = async (
    workspaceId,
    worksapceData,
    userId
) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace){
            throw new clientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCodes: StatusCodes.NOT_FOUND,
            });
        }

        const isAdmin = isUserAdminOfWorkspace(workspace, userId);
        if(!isAdmin){
            throw new clientError({
                explanation: "User is not an admin of the workspace",
                message: "User is not an admin of the workspace",
                statusCodes: StatusCodes.UNAUTHORIZED,
            });
        }

        const updateWorkspace = await workspaceRepository.update(workspaceId, worksapceData);
        return updateWorkspace;
    } catch (error) {
        console.log("update workspace error", error);
        throw error;
    }
}

export const addMemberToWorkspaceService = async (
    workspaceId, 
    memberId, 
    role,
    userId  
) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace){
            throw new clientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCodes: StatusCodes.NOT_FOUND,
            });
        }

        const isAdmin = isUserAdminOfWorkspace(workspace, userId);
        if(!isAdmin){
            throw new clientError({
                explanation: 'User is not an admin of the workspace',
                message: 'User is not an admin of the workspace',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const isValidUser = await userRepository.getById(memberId);
        if(!isValidUser){
            throw new clientError({
                explanation: "Invalid data sent from the client",
                message: "User not found",
                statusCodes: StatusCodes.NOT_FOUND,
            });
        }

        const isMember = isUserMemberOfWorkspace(workspace, memberId);
        if(isMember){
            throw new clientError({
                explanation: "User is  already a member of the workspace",
                message: "User is  already a member of the workspace",
                statusCodes: StatusCodes.UNAUTHORIZED,
            });
        }

        const response = await workspaceRepository.addMemberToWorkspace(workspaceId, memberId, role);

        addEmailToMailQueue({
            ...workspaceJoinMail(workspace),
            to: isValidUser.email
        });

        return response;
    } catch (error) {
        console.log("add member to workspace error", error);
        throw error;
    }
}

export const addChannelToWorkspaceService = async (
    workspaceId, 
    channelName,
    userId
) => {
    try {
        const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);

        if(!workspace){
            throw new clientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCodes: StatusCodes.NOT_FOUND,
            });
        }

        const isAdmin = isUserAdminOfWorkspace(workspace, userId);
        if(!isAdmin){
            throw new clientError({
                explanation: "User is not an admin of the workspace",
                message: "User is not an admin of the workspace",
                statusCodes: StatusCodes.UNAUTHORIZED,
            });
        }

        const isChannelPartOfWorkspace = isChannelIsAlreadyPartOfWorkspace(workspace, channelName);
        if(isChannelPartOfWorkspace){
            throw new clientError({
                explanation: "Invalid data send from the user",
                message: "Channel is already part of workspace",
                statusCodes: StatusCodes.FORBIDDEN
            });
        }

        const response = await workspaceRepository.addChannelToWorkspace(workspaceId, channelName);
        return response;
    } catch (error) {
        console.log("add channel to workspace error", error);
        throw error;
    }
}