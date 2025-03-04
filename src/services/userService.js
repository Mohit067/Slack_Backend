import bcrypt from 'bcrypt';
import { StatusCodes } from "http-status-codes";

import userRepository from "../repositories/userRepository.js"
import { createJWT } from "../utils/common/authUtilis.js";
import clientError from "../utils/errors/clientError.js";
import ValidationError from "../utils/errors/validationError.js";
export const signUpService = async (data) => {
    try {
        const newUser = await userRepository.create(data);
        console.log(newUser);
        return newUser;
        
    } catch (error) {
        console.log('User service error', error);
        console.log("user servie errroror name is ::: ", error.name)
        console.log("this is the code ::: ", error.code);
        if(error.name === 'ValidationError'){
            throw new ValidationError(
                {
                    error: error.errors
                }, 
                error.message
            );
        }
        if(error.name === "MongooseError"){
            console.log("Custom error response sdfsdfsdfsdfs:", error);
            
            throw new ValidationError(
                {
                    error: ['A user with the same email or username already exists']
                }, 
                'A user with the same email or username already exists'
            );
        }
    }
}

export const signInService = async (data) => {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'user not register with this email',
                statusCodes: StatusCodes.NOT_FOUND,
            });
        }

        // trying to match the password
        const isMathc = bcrypt.compareSync(data.password, user.password);
        if(!isMathc){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'Invalid password please try again',
                statusCodes: StatusCodes.BAD_REQUEST,
            });
        }

        return{
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            token: createJWT({id: user._id, email: user.email})
        }

    } catch (error) {
        console.log('User service error', error)
        throw error;
    }
}