import userRepository from "../repositories/userRepository.js"
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