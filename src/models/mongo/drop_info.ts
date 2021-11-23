import { getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: 'drop_info'
  }
})
export class MDropInfo {
}

export const MDropInfoModel = getModelForClass(MDropInfo);
