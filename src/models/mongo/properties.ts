import { getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: 'properties'
  }
})
export class MProperties {
}

export const MPropertiesModel = getModelForClass(MProperties);
