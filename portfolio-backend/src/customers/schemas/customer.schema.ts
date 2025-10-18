import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  message: string;

  @Prop({ default: Date.now })
  submissionDate: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
