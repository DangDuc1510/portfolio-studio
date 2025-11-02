import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
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

  @Prop({ 
    type: String, 
    enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  })
  status: string;

  @Prop()
  note: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
