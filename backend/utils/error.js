export const CreateError = ( status, message, data) => {
    const error = new Error(message);
    error.status = status;
    error.message = message;
    error.data = data;
    return error;
};