import mongoose from 'mongoose';

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Mongodb connected.');
  } catch (error) {
    return error;
  }
};
