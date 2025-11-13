import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAttemptDetail {
  questionId: Types.ObjectId;
  selectedIndex: number;
  correct: boolean;
}

export interface IAttempt extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  score: number;
  total: number;
  percentage: number;
  detail: IAttemptDetail[];
  createdAt: Date;
}

const attemptDetailSchema = new Schema<IAttemptDetail>({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedIndex: {
    type: Number,
    required: true,
    min: 0
  },
  correct: {
    type: Boolean,
    required: true
  }
});

const attemptSchema = new Schema<IAttempt>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category ID is required']
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 1
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  detail: [attemptDetailSchema]
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Index for leaderboard queries
attemptSchema.index({ categoryId: 1, percentage: -1, createdAt: -1 });
attemptSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IAttempt>('Attempt', attemptSchema);