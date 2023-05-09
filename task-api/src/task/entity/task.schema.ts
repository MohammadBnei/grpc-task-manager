import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as schema, Types } from 'mongoose';
import { FieldType } from 'src/stubs/task/v1beta/message';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ type: Types.ObjectId })
  _id: ObjectId;

  @Prop({ unique: true, index: true })
  name: string;

  @Prop(
    raw({
      type: schema.Types.Map,
      of: {
        fieldType: schema.Types.Number,
        value: schema.Types.String,
      },
      default: new Map(),
    }),
  )
  fields: IFields;

  @Prop()
  dueDate: Date;

  fieldsArray: FieldsArray;

  @Prop({ type: Boolean })
  done = false;
}

export type FieldsArray = { type: FieldType; value: string; name: string }[];
export type IFields = Map<string, { type: FieldType; value: string }>;

const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.virtual('fieldsArray')
  .get(function (this: TaskDocument) {
    return [...this.fields.entries()].map(([name, { type, value }]) => ({
      name,
      value,
      type,
    }));
  })
  .set(function (this: TaskDocument, fieldsArray: FieldsArray) {
    for (const { name, type, value } of fieldsArray) {
      this.fields.set(name, { type, value });
    }
  });

export { TaskSchema };
