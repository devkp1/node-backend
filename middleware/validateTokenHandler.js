import jwt from 'jwt';
import logger from '../logger';
import dotenv from 'dotenv';
dotenv.config();

export const iaAuthenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).send({
        success: false,
        message: 'Please login to access this response.',
      });
    }

    try {
      const decodeData = jwt.verify(
        token.split(' ')[1],
        process.env.SECRET_TOKEN,
      );

      req.user = decodeData;
      next();
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return res.status(400).send({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    next(error);
  }
};
