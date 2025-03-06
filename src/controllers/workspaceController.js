import { StatusCodes } from "http-status-codes";

import { createWorkspaceService, deleteWorkspaceService, getWorkspacesUserIsMemberOfService } from "../services/workspaceService.js";
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
        console.log("deleting workspace error", error);
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