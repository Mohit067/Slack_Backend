export const internullServerError = (error) => {
    console.log("this is the error", error);
    console.log(error.message);
    return {
        success: false,
        err: error, 
        data: {},
        message: "Internal server error"
    };
};


export const customErrorResponse = (error) => {
    console.log("Custom error response:", error);

    if(!error.message && !error.explanation){
        return internullServerError(error);
    }
    return {
        success: false,
        err: error.explanation,
        data: {},
        message: error.message
    };
};

export const successResponse = (data, message) => {
    return {
        success: true,
        message,
        data,
        err: {}
    };
};