import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4} from 'uuid';
import mongoose from "mongoose";

import channelRepository from '../repositories/channelRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js";
import clientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

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
        const isAllowed = workspace.members.find(
            (member) => member.memberId.toString() === userId.toString() && member.role === "admin"
        );

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
