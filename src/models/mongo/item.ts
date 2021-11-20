import { getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: 'item'
  }
})
export class MItem {
}

export const MItemModel = getModelForClass(MItem);
