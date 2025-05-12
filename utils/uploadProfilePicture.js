import cloudinary from '../config/imageConfig/cloudinary.config.js';
import { ImageUploadErrorMessage } from '../constants/errorMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
import logger from '../logger.js';
import { errorResponse } from './responseHandler.js';

export const uploadProfilePicture = async (file, res) => {
  if (!file) return null;

  const imageData = file.buffer.toString('base64');
  const dataUrl = `data:${file.mimetype};base64,${imageData}`;

  try {
    const fileUrl = await cloudinary.uploader.upload(dataUrl, {
      resource_type: 'image',
      folder: 'profile_picture',
    });

    return fileUrl?.url || null;
  } catch (uploadError) {
    logger.error(`uploadProfilePicture error.......... ${uploadError.message}`);
    return errorResponse(
      res,
      uploadError,
      ImageUploadErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
