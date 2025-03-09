import { StatusCodes } from "http-status-codes";

import { getChannelById } from "../services/channelService.js";
import { 
    customErrorResponse, 
    internullServerError, 
    successResponse
} from "../utils/common/responseObject.js";

export const getChannelByIdController = async (req, res) => {
    try {
        const response = await getChannelById(req.params.channelId, req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Channel fetch successfully"));
    } catch (error) {
        console.log("getting channel controller error", error);
        if(error.statusCode){
                    return res
                    .status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(customErrorResponse( error));
                }
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(internullServerError(error));
    }
}