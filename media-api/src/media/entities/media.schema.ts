import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type MediaDocument = HydratedDocument<Media>;

@Schema()
export class Media {
  @Prop({ unique: true, index: true })
  name: string;

  @Prop()
  type: string;

  @Prop()
  link: string;

  @Prop()
  taskId: string;
}

const MediaSchema = SchemaFactory.createForClass(Media);

export { MediaSchema };
