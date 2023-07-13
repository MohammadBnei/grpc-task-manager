import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as schema, Types } from 'mongoose';
import { FieldType } from 'src/stubs/race/v1beta/message';

export type RaceDocument = HydratedDocument<Race>;

@Schema()
export class Race {
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

const RaceSchema = SchemaFactory.createForClass(Race);

RaceSchema.virtual('fieldsArray')
  .get(function (this: RaceDocument) {
    return [...this.fields.entries()].map(([name, { type, value }]) => ({
      name,
      value,
      type,
    }));
  })
  .set(function (this: RaceDocument, fieldsArray: FieldsArray) {
    for (const { name, type, value } of fieldsArray) {
      this.fields.set(name, { type, value });
    }
  });

export { RaceSchema };
