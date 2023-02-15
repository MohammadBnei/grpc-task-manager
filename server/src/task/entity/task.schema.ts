import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as schema } from 'mongoose';
import { FieldType } from 'src/stubs/task/v1beta/task';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ unique: true, index: true })
  name: string;

  @Prop(
    raw({
      type: schema.Types.Map,
      of: {
        fieldType: schema.Types.Number,
        value: schema.Types.String,
      },
    }),
  )
  fields: IFields = new Map();

  @Prop()
  dueDate: Date;
}

export type IFields = Map<string, { type: FieldType; value: string }>;
export const TaskSchema = SchemaFactory.createForClass(Task);
