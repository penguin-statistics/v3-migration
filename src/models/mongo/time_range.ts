import { getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: 'time_range'
  }
})
export class MTimeRange {
}

export const MTimeRangeModel = getModelForClass(MTimeRange);
