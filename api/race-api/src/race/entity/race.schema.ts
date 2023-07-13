import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as schema } from 'mongoose';

export type RaceDocument = HydratedDocument<Race>;

@Schema()
export class RaceParticipation {
  @Prop({ type: schema.Types.ObjectId })
  driver_id: string;

  @Prop({ type: schema.Types.ObjectId })
  car_id: string;
}

@Schema()
export class Race {
  @Prop({ unique: true, index: true })
  name: string;

  @Prop([RaceParticipation])
  participations: IRaceParticipation[];

  @Prop()
  date: Date;
}

export type IRaceParticipation = {
  driver_id: string;
  car_id: string;
};

const RaceSchema = SchemaFactory.createForClass(Race);

export { RaceSchema };
