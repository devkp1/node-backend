import bcrypt from 'bcryptjs';

export const getHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (inputPassword, userPassword) => {
  return bcrypt.compare(inputPassword, userPassword);
};
