import mongoose, { Schema } from 'mongoose';
import { CityModelSchema } from '../../../constants/modelNameConstants';

const citySchema = new Schema({
  name: { type: String, required: true },
  stateCode: { type: String, required: true },
  countryCode: { type: String, required: true },
  postalCode: [{ type: String }],
});

const City = mongoose.model(CityModelSchema, citySchema);

export default City;
