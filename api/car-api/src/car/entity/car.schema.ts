import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

@Schema()
export class Car {
  @Prop()
  driver_id: string;

  @Prop()
  brand: string;

  @Prop()
  model: string;
}

const CarSchema = SchemaFactory.createForClass(Car);

export { CarSchema };
