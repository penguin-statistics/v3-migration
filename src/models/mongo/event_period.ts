import { getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: 'event_period'
  }
})
export class MEventPeriod {
}

export const MEventPeriodModel = getModelForClass(MEventPeriod);
