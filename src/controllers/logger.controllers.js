import envConfig from "../config/env.config.js";
const getLoggerTesting = async (req, res) => {
    try {
        req.logger.debug('Este es un mensaje de depuración.');
        req.logger.http('Este es un mensaje HTTP.');
        req.logger.info('Este es un mensaje de información.');
        req.logger.warn('Este es un mensaje de advertencia.');
        req.logger.error('Este es un mensaje de error.');
        req.logger.fatal('Este es un mensaje fatal.');
  
        return res.status(200).json({ status: 'success', msg: 'Esto es un test, mirar consola de node.' });
      } catch (error) {
        req.logger.error(error);
      }
}

export {
    getLoggerTesting
}