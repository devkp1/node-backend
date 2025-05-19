import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  const payload = {
    id: user?.id || user?.id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: '12h' });
};
