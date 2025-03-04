import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internullServerError } from "../utils/common/responseObject";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/serverConfig.js";
import userRepository from "../repositories/userRepository.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if(!token){
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from client',
                    message: 'No auth token provided'
                })
            );
        }

        const response = jwt.verify(token, JWT_SECRET);
        if(!response){
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from client',
                    message: 'Invalid auth token provided'
                })
            );
        }
        const user = await userRepository.getById(response.id);
        req.user = user.id;
        next();
    } catch (error) {
        console.log("Auth middlerware error", error);
        console.log("name is here ::::: ", error.name);
        if(error.name === 'JsonWebTokeError'){
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from client',
                    message: 'Invalid auth token provided'
                })
            );
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
};