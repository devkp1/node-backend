import mongoose, { Schema } from 'mongoose';
import { StateModelSchema } from '../../../constants/modelNameConstants.js';

const stateSchema = new Schema({
  name: { type: String, required: true },
  isoCode: { type: String, required: true },
  countryCode: { type: String, required: true },
});

const State = mongoose.model(StateModelSchema, stateSchema);

export default State;
