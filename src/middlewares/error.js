import { EErros } from "../errors/enums.js";
import { logger } from "./logger.js";

export default (error, req, res, next) => {
    logger.error(error.cause);

    switch (error.code) {
        case EErros.INVALID_TYPE_ERROR:
            res
                .status(400)
                .send({ status: 'error', error: error.name, cause: error.cause });
            break;
        case EErros.INVALID_PRODUCT_FORMAT:
            res
                .status(400)
                .send({ status: 'error', error: error.name, message: error.message, cause: error.cause });
            break;
        case EErros.PRODUCT_ALREADY_EXISTS:
            res
                .status(400)
                .send({ status: 'error', error: error.name, cause: error.cause });
            break;
        case EErros.CART_EMPTY:
            res
                .status(400)
                .send({ status: 'error', error: error.name, cause: error.cause });
            break;

        default:
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
                payload: {},
            });
            break;
    }
}