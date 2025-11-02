import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IHomepageSection extends Document {
  sectionName: string;
  isVisible?: boolean;
  content?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

const HomepageSectionSchema = new Schema<IHomepageSection>(
  {
    sectionName: { type: String, required: true, unique: true },
    isVisible: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const HomepageSection: Model<IHomepageSection> =
  mongoose.models.HomepageSection ||
  mongoose.model<IHomepageSection>('HomepageSection', HomepageSectionSchema);

export default HomepageSection;

