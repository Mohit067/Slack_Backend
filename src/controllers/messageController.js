import { StatusCodes } from "http-status-codes";

import { getMessageService } from "../services/messageService.js";
import { 
    customErrorResponse, 
    internullServerError, 
    successResponse 
} from "../utils/common/responseObject.js";

export const getMessageController = async (req, res) => {
    try {
        const message = await getMessageService({
            channelId: req.params.channelId,
        },
        req.query.page || 1,
        req.query.limit || 20,
        req.user
    );

    return res
        .status(StatusCodes.OK)
        .json(successResponse(message, 'Messages fetch successfully'));
    } catch (error) {
        console.log("message controller error", error);
                
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