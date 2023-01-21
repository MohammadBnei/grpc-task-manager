import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as schema } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ unique: true, index: true })
  name: string;

  @Prop()
  fields: schema.Types.Mixed;

  @Prop()
  dueDate: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
