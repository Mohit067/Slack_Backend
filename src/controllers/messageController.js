import { StatusCodes } from "http-status-codes";

import { s3 } from "../config/awsConfig.js";
import { AWS_BUCKET_NAME } from "../config/serverConfig.js";
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

export const getPresignedUrlFromAWS = async (req, res) => {
    try {
      const url = await s3.getSignedUrlPromise('putObject', {
        Bucket: AWS_BUCKET_NAME,
        Key: `${Date.now()}`,
        Expires: 60 // 1 minute
      });
      return res
            .status(StatusCodes.OK)
            .json(successResponse(url, 'Presigned URL generated successfully'));
            
    } catch (err) {
      console.log('Error in getPresignedUrlFromAWS', err);
      if(err.statusCode) {
        return res.status(err.statusCode).json(customErrorResponse(err));
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internullServerError(err));
    }
  }