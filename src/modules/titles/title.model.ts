import mongoose, { Schema } from 'mongoose';

const TitleSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['movie', 'series'],
      required: true
    },

    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    language: {
      type: String,
      required: true
    },

    isLive: {
      type: Boolean,
      default: false
    },

    genres: {
      type: [String],
      required: true
    },

    releaseYear: {
      type: Number,
      required: true
    },

    thumbnailUrl: String
  },
  { timestamps: true }
);

export const Title = mongoose.model('Title', TitleSchema);