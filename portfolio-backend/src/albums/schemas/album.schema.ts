import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  coverImage: string;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  productIds: Types.ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
