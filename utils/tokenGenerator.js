import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.SECRET_TOKEN,
    { expiresIn: '12h' },
  );
};
