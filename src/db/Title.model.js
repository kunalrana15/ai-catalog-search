import mongoose,{Document,Schema} from "mongoose";



const TitleSchema = new Schema({
    type: {type: String, enum: ['movie','series'], required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    language: {type: String, required: true},
    isLive: {type: Boolean, default: false},
    genres: {type: [String], required: true},
    releaseYear: {type: Number, required: true},
    thumbnailUrl: {type: String}
}, {timestamps: true});

export default mongoose.model('Title', TitleSchema);