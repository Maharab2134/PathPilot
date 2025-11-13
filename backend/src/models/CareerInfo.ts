import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICareerInfo extends Document {
  categoryId: Types.ObjectId;
  title: string;
  description: string;
  skills: string[];
  learningPath: string[];
  youtubeLinks: string[];
  bookLinks: string[];
  courseLinks: string[];
  minScore: number;
  createdAt: Date;
}

const careerInfoSchema = new Schema<ICareerInfo>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Career title is required"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Career description is required"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    learningPath: [
      {
        type: String,
        required: true,
      },
    ],
    youtubeLinks: [
      {
        type: String,
        validate: {
          validator: function (url: string) {
            return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(
              url
            );
          },
          message: "Please provide valid YouTube URLs",
        },
      },
    ],
    bookLinks: [
      {
        type: String,
        validate: {
          validator: function (url: string) {
            return /^https?:\/\/.+\..+/.test(url);
          },
          message: "Please provide valid book URLs",
        },
      },
    ],
    courseLinks: [
      {
        type: String,
        validate: {
          validator: function (url: string) {
            return /^https?:\/\/.+\..+/.test(url);
          },
          message: "Please provide valid course URLs",
        },
      },
    ],
    minScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model<ICareerInfo>("CareerInfo", careerInfoSchema);
