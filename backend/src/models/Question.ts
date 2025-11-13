import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IQuestion extends Document {
  categoryId: Types.ObjectId;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      minlength: [10, 'Question text must be at least 10 characters'],
      maxlength: [1000, 'Question text cannot be more than 1000 characters'],
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (this: IQuestion, options: string[]) {
          return (
            Array.isArray(options) && options.length >= 2 && options.length <= 5
          );
        },
        message: 'Question must have between 2 and 5 options',
      },
    },
    correctIndex: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: [0, 'Correct index must be at least 0'],
      validate: {
        validator: function (this: IQuestion, value: number) {
          return value >= 0 && value < this.options.length;
        },
        message: 'Correct index must be a valid option index',
      },
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    explanation: {
      type: String,
      maxlength: [1000, 'Explanation cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for random sampling
questionSchema.index({ categoryId: 1, difficulty: 1 });

export default mongoose.model<IQuestion>('Question', questionSchema);
