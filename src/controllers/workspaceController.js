import { StatusCodes } from "http-status-codes";

import { verifyTokenService } from "../services/userService.js";
import { 
    addChannelToWorkspaceService,
    addMemberToWorkspaceService,
    createWorkspaceService, 
    deleteWorkspaceService, 
    getWorkspaceByjoinCodeService, 
    getWorkspaceService, 
    getWorkspacesUserIsMemberOfService, 
    joinWorkspaceService, 
    resetWorkspaceJoinCodeService, 
    updateWorkspaceService
} from "../services/workspaceService.js";
import { 
    customErrorResponse, 
    internullServerError, 
    successResponse 
} from "../utils/common/responseObject.js";

export const createWorkspaceController = async (req, res) => {
    try {
        const response = await createWorkspaceService({
            ...req.body,
            owner: req.user
        });
        return res.status(StatusCodes.CREATED).json(successResponse(
            response, 
            'Workspace created successfully'
        ));
    } catch (error) {
        console.log('workspace controller error', error);

        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const getWorkspacesUserIsMemberOfController = async (req, res) => {
    try {
        const response = await getWorkspacesUserIsMemberOfService(req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Workspaces fetched successfully"));

    } catch (error) {
        console.log("fetch controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const deleteWorkspaceController = async (req, res) => {
    try {
        
        const response = await deleteWorkspaceService(req.params.workspaceId, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Workspaces delete successfully"));
    } catch (error) {
        console.log("deleting workspace controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const getWorkspaceController = async (req, res) => {
    try {
        const response = await getWorkspaceService(req.params.workspaceId, req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspaces fetch successfully")
        );
    } catch (error) {
        console.log("fetching workspace controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const getWorkspaceByjoinCodeConroller = async (req, res) => {
    try {
        const response = await getWorkspaceByjoinCodeService(
            req.params.joinCode, 
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspaces fetch successfully")
        );
    } catch (error) {
        console.log("fetching workspace by joinCode controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const updateWorkspaceConroller = async (req, res) => {
    try {
        const response = await updateWorkspaceService(
            req.params.workspaceId, 
            req.body,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspaces updated successfully")
        );
    } catch (error) {
        console.log("updating workspace controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const addMemberToWorkspaceController = async (req, res) => {
    try {
        const response = await addMemberToWorkspaceService(
            req.params.workspaceId,
            req.body.memberId,
            req.body.role || 'member',
            req.user
        );

        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'Member added to workspace successfulyy'));
    } catch (error) {
        console.log("add member to  workspace controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const addChannelToWorkspaceController = async (req, res) => {
    try {
        const response = await addChannelToWorkspaceService(
            req.params.workspaceId,
            req.body.channelName,
            req.user
        );

        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'channel added to workspace successfulyy'));
    } catch (error) {
        console.log("add channel to  workspace controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const resetWorkspaceJoinCodeController  = async (req, res) => {
    try {
        const response = await resetWorkspaceJoinCodeService(
            req.params.workspaceId,
            req.user
        );
        return res
            .status(StatusCodes.OK).
            json(successResponse(response, 'join code reset successfully'))
    } catch (error) {
        console.log("reset Workspace JoinCode Controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const joinWorkspaceController = async (req, res) => {
    try {
        const response = await joinWorkspaceService(
            req.params.workspaceId,
            req.body.joinCode,
            req.user
        );
        return res
            .status(StatusCodes.OK).
            json(successResponse(response, 'join workspace successfully'))
    } catch (error) {
        console.log("join Workspace Controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const verifyEmailController = async (req, res) => {
    try {
        const response = await verifyTokenService(req.params.token);
        console.log(req.params.token);
        return res
            .status(StatusCodes.OK).
            json(successResponse(response, 'Email verified successfully'))
    } catch (error) {
        console.log("Email verif Controller error", error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse( error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}