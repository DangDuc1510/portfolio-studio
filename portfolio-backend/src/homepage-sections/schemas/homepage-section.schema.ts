import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomepageSectionDocument = HomepageSection & Document;

@Schema()
export class HomepageSection {
  @Prop({ required: true, unique: true })
  sectionName: string;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: Object })
  content: Record<string, any>; // Flexible schema for content
}

export const HomepageSectionSchema = SchemaFactory.createForClass(HomepageSection);
