import * as mongoose from 'mongoose';
import { model } from 'mongoose';

const bannerSchema = new mongoose.Schema({
    banner: { type: String, required: true},
    restaurant_id: { type: mongoose.Types.ObjectId, ref: 'restaurant'},
    status: { type: Boolean, required: true, default: true},
    created_at: {type: String, required: true, default: new Date()},
    updated_at: {type: String, required: true, default: new Date()},
});

export default model('banner', bannerSchema);