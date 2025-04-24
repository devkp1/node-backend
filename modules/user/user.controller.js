import userModel from './user.model.js';
import bcrypt from 'bcryptjs';

export const registerUser = (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const allowedFields = ['firstName', 'lastName', 'email', 'password'];
    const extraFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field),
    );

    if (extraFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: `Additional fields (${extraFields.join(', ')}) are not allowed for registration.`,
      });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = await userModel.create({
        firstName, lastName, email, password: hashedPassword,
    })

    return res.status(200).json({
        status: true,
        user
    });

  } catch (error) {
    return res.status(500).json({
        status: false,
        message: JSON.stringify(error)
    })
  }
};
