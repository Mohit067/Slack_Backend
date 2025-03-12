import { StatusCodes } from "http-status-codes";

import { isMemberAlreadyPartOfWorkspaceService } from "../services/memberService.js";
import { 
    customErrorResponse, 
    internullServerError, 
    successResponse
} from "../utils/common/responseObject.js";

export const isMemberAlreadyPartOfWorkspaceController = async (req, res) => {
    try {
        const response = await isMemberAlreadyPartOfWorkspaceService(
            req.params.workspaceId,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, 'User is member of Workspace'));
    } catch (error) {
        console.log("member controller error", error);
        
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