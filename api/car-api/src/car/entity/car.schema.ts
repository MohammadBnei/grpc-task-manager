import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

@Schema()
export class Car {
  @Prop({ required: true })
  driver_id: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;
}

const CarSchema = SchemaFactory.createForClass(Car);

CarSchema.index({ driver_id: 1, brand: 1, model: 1 }, { unique: true });

export { CarSchema };
