import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop([String])
  images: string[];

  @Prop()
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Album' })
  albumId: Types.ObjectId;

  @Prop()
  videoUrl: string;

  @Prop()
  thumbnail: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
