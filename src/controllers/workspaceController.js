import { StatusCodes } from "http-status-codes";

import { createWorkspaceService } from "../services/workspaceService.js";
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