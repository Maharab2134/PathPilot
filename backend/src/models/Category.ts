import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.model<ICategory>('Category', categorySchema);