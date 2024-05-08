// CustomErrorMiddleware.js
import CustomError from '../CustomError.js';
import  EErrors  from '../errors-enum.js';

export default (error, req, res, next) => {
    Devlogger.error('Error detectado entrando al Error Handler:');
    Devlogger.error(`Name: ${error.name}`);
    Devlogger.error(`Code: ${error.errorCode}`);
    Devlogger.error(`Message: ${error.message}`);

    if (error.additionalInfo) {
        Devlogger.error('Additional Info:', error.additionalInfo);
    }


    switch (error.errorCode) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).json({ status: 'error', error: error.message });
            break;
        case EErrors.PRODUCT_NOT_FOUND_ERROR:
            res.status(404).json({ status: 'error', error: error.message });
            break;
        default:
            res.status(500).json({ status: 'error', error: 'Unhandled error!' });
    }
};
