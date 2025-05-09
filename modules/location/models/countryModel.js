import mongoose, { Schema } from 'mongoose';
import { CountryModelSchema } from '../../../constants/modelNameConstants.js';

const countrySchema = new Schema({
  name: { type: String, required: true },
  isoCode: { type: String, required: true },
  phoneCode: { type: String, required: true },
  flag: { type: String, required: true },
});

const Country =
  mongoose.models[CountryModelSchema] ||
  mongoose.model(CountryModelSchema, countrySchema);

export default Country;
